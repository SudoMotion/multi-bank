import { usePage } from '@inertiajs/react';

export function useCan() {
    const { permissions = [], isSuperAdmin = false } = usePage().props.auth ?? {};

    return (permission) => {
        if (!permission) {
            return true;
        }

        return isSuperAdmin || permissions.includes(permission);
    };
}

export function usePermissions() {
    const { permissions = [], isSuperAdmin = false } = usePage().props.auth ?? {};

    return { permissions, isSuperAdmin };
}
