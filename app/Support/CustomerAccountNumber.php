<?php

namespace App\Support;

class CustomerAccountNumber
{
    public static function formatForDisplay(string $digits): string
    {
        $digits = preg_replace('/\D/', '', $digits) ?? '';

        if (strlen($digits) !== 16) {
            return $digits;
        }

        return substr($digits, 0, 4).' '
            .substr($digits, 4, 4).' '
            .substr($digits, 8, 4).' '
            .substr($digits, 12, 4);
    }
}
