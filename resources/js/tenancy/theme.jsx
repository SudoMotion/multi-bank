/**
 * Per-tenant theming with automatic fallback to the default design.
 *
 * A theme is a folder in resources/js/Themes/{theme} that mirrors the app's
 * own structure. Any file it provides replaces the default one:
 *
 *   Themes/{theme}/Pages/Frontend/Home/Index.jsx   overrides Pages/Frontend/Home/Index.jsx
 *   Themes/{theme}/Layouts/Frontend/FrontendNavbar.jsx  overrides Layouts/Frontend/FrontendNavbar.jsx
 *   Themes/{theme}/Components/Frontend/BankCard.jsx     overrides Components/Frontend/BankCard.jsx
 *
 * Pages are swapped automatically. Layouts and components opt in by wrapping
 * their default export with themeable('<path without .jsx>', Component).
 * Overrides can reuse the original through `ImportedComponent.Default`.
 */

const defaultPages = import.meta.glob('../Pages/**/*.jsx');
const themePages = import.meta.glob('../Themes/*/Pages/**/*.jsx');
const themeParts = import.meta.glob('../Themes/*/{Layouts,Components}/**/*.jsx');

const DEFAULT_THEME = 'default';

let activeTheme = DEFAULT_THEME;
let overrides = {};

export function readInitialPage(id = 'app') {
    try {
        const element = document.getElementById(id);
        const script = document.querySelector(
            `script[data-page="${id}"][type="application/json"]`,
        );

        return JSON.parse(element?.dataset.page || script?.textContent || '{}');
    } catch {
        return {};
    }
}

export function readInitialTheme(page = readInitialPage()) {
    return page?.props?.tenant?.theme || DEFAULT_THEME;
}

/**
 * Loads the active theme's layout/component overrides before the first render
 * so there is no flash of the default design. A host never changes theme
 * mid-session, so this runs once.
 */
export async function bootTheme(theme) {
    activeTheme = theme || DEFAULT_THEME;
    overrides = {};

    if (activeTheme === DEFAULT_THEME) {
        return;
    }

    const prefix = `../Themes/${activeTheme}/`;
    const entries = Object.entries(themeParts).filter(([path]) => path.startsWith(prefix));

    const loaded = await Promise.all(
        entries.map(async ([path, load]) => {
            const module = await load();

            return [path.slice(prefix.length, -'.jsx'.length), module.default];
        }),
    );

    overrides = Object.fromEntries(loaded);
}

export function activeThemeName() {
    return activeTheme;
}

export function resolveThemedPage(name) {
    const load =
        themePages[`../Themes/${activeTheme}/Pages/${name}.jsx`] ??
        defaultPages[`../Pages/${name}.jsx`];

    if (!load) {
        throw new Error(`Page not found: ${name}`);
    }

    return load();
}

export function themeable(key, DefaultComponent) {
    function Themed(props) {
        const Component = overrides[key] ?? DefaultComponent;

        return <Component {...props} />;
    }

    Themed.Default = DefaultComponent;
    Themed.displayName = `Themeable(${key})`;

    return Themed;
}
