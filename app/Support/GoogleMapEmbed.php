<?php

namespace App\Support;

class GoogleMapEmbed
{
    public static function normalize(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        $value = trim($value);

        if (preg_match('/src=["\']([^"\']+)["\']/i', $value, $matches)) {
            return html_entity_decode($matches[1], ENT_QUOTES);
        }

        if (preg_match('/^https?:\/\//i', $value)) {
            return $value;
        }

        return $value;
    }
}
