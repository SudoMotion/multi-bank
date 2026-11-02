import { usePage } from '@inertiajs/react';

/**
 * Current bank for this host, or null on the central platform domain.
 */
export function useTenant() {
    return usePage().props.tenant ?? null;
}

export function useIsCentral() {
    return usePage().props.tenancy?.isCentral ?? true;
}

export function useTenantSetting(key, fallback = null) {
    const tenant = useTenant();

    return tenant?.settings?.[key] ?? fallback;
}
