export const SOCIAL_MEDIA_PLATFORMS = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'x', label: 'X (Twitter)' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'discord', label: 'Discord' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'threads', label: 'Threads' },
    { value: 'github', label: 'GitHub' },
    { value: 'dribbble', label: 'Dribbble' },
    { value: 'behance', label: 'Behance' },
    { value: 'medium', label: 'Medium' },
    { value: 'vimeo', label: 'Vimeo' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'spotify', label: 'Spotify' },
];

export function getSocialMediaPlatformOptions(currentValue = '') {
    const options = [...SOCIAL_MEDIA_PLATFORMS];

    if (currentValue && !options.some((option) => option.value === currentValue)) {
        options.push({ value: currentValue, label: currentValue });
    }

    return options;
}
