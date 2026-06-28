import { Head, usePage } from '@inertiajs/react';

export default function SiteFavicon() {
    const { site } = usePage().props;

    if (!site?.favicon_url) {
        return null;
    }

    return (
        <Head>
            <link rel="icon" href={site.favicon_url} />
        </Head>
    );
}
