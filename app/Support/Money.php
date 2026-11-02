<?php

namespace App\Support;

use InvalidArgumentException;
use NumberFormatter;

/**
 * Converts between user-entered decimal strings and integer minor units.
 * Never use floats for balances.
 */
class Money
{
    public const DECIMAL_PATTERN = '/^\d{1,13}(\.\d{1,2})?$/';

    public static function toMinor(string|int $amount): int
    {
        $amount = trim((string) $amount);

        if (! preg_match(self::DECIMAL_PATTERN, $amount)) {
            throw new InvalidArgumentException("Invalid amount [{$amount}].");
        }

        [$whole, $fraction] = array_pad(explode('.', $amount, 2), 2, '');

        return ((int) $whole * 100) + (int) str_pad($fraction, 2, '0');
    }

    public static function toDecimal(int $minor): string
    {
        $sign = $minor < 0 ? '-' : '';
        $minor = abs($minor);

        return $sign.intdiv($minor, 100).'.'.str_pad((string) ($minor % 100), 2, '0', STR_PAD_LEFT);
    }

    public static function format(int $minor, string $currency): string
    {
        if (class_exists(NumberFormatter::class)) {
            $formatter = new NumberFormatter('en_CA', NumberFormatter::CURRENCY);
            $formatted = $formatter->formatCurrency($minor / 100, $currency);

            if ($formatted !== false) {
                return $formatted;
            }
        }

        return $currency.' '.number_format($minor / 100, 2);
    }
}
