<?php

namespace App\Support;

/**
 * Static marketing content for the RBC theme until CMS modules (sliders, blogs, awards) exist per tenant.
 */
class RbcHomeContent
{
    /**
     * @return array{sliders: list<array<string, mixed>>, blogs: list<array<string, mixed>>, awards: list<array<string, mixed>>}
     */
    public static function marketing(): array
    {
        return [
            'sliders' => self::sliders(),
            'blogs' => self::blogs(),
            'awards' => self::awards(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function sliders(): array
    {
        return [
            [
                'id' => 1,
                'badge_text' => 'Online Banking',
                'title' => 'Banking that fits the way you live and work',
                'subtitle' => 'Secure access to your accounts, payments, and everyday banking — anytime.',
                'description' => 'Takes about 5 minutes to sign in',
                'link_text' => 'Banking that fits the way you live and work',
                'image_url' => '/images/header-bg.png',
                'buttons' => [
                    ['text' => 'Sign In', 'url' => '/login', 'color' => 'yellow'],
                    ['text' => 'Contact Us', 'url' => '/contact', 'color' => 'outline'],
                ],
            ],
            [
                'id' => 2,
                'badge_text' => 'Personal',
                'title' => 'Plans and advice for what matters most',
                'subtitle' => 'From chequing and savings to borrowing and investing.',
                'description' => null,
                'link_text' => 'Plans and advice for what matters most',
                'image_url' => '/images/header-bg.png',
                'buttons' => [
                    ['text' => 'Explore Products', 'url' => '/about', 'color' => 'white'],
                ],
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function blogs(): array
    {
        return [
            [
                'id' => 1,
                'headline' => 'Savings',
                'title' => 'Simple ways to build your emergency fund',
                'slug' => 'emergency-fund',
                'description' => 'Practical steps to grow a cushion for unexpected expenses.',
                'image_url' => null,
                'published_at' => 'November 1, 2026',
            ],
            [
                'id' => 2,
                'headline' => 'Security',
                'title' => 'Protect yourself from fraud and scams',
                'slug' => 'fraud-protection',
                'description' => 'Recognize common scams and keep your accounts safe.',
                'image_url' => null,
                'published_at' => 'October 15, 2026',
            ],
            [
                'id' => 3,
                'headline' => 'Planning',
                'title' => 'Planning ahead for major life milestones',
                'slug' => 'life-milestones',
                'description' => 'How to budget for home, education, and retirement goals.',
                'image_url' => null,
                'published_at' => 'October 3, 2026',
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function awards(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Best Online Banking',
                'description' => 'Recognized for secure, easy-to-use digital banking experiences.',
                'image_url' => '/images/rbc-logo-shield.svg',
            ],
            [
                'id' => 2,
                'title' => 'Customer Service Excellence',
                'description' => 'Awarded for commitment to supporting clients across channels.',
                'image_url' => '/images/rbc-logo-shield.svg',
            ],
        ];
    }
}
