<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SlugHelper
{
    /**
     * Main entry: create a unique slug.
     */
    public static function create(
        string $source,
        string $table,
        string $column = 'slug',
        int $maxLength = 100
    ): string {
        $base = self::sanitize($source);
        $base = self::truncate($base, $maxLength);

        if (self::isAvailable($base, $table, $column)) {
            return $base;
        }

        return self::makeUnique($base, $table, $column, $maxLength);
    }

    /**
     * Sanitize input into a slug.
     */
    public static function sanitize(string $value): string
    {
        $slug = Str::slug($value);

        return $slug ?: self::random();
    }

    /**
     * Ensure slug uniqueness by appending a number.
     */
    public static function makeUnique(
        string $base,
        string $table,
        string $column,
        int $maxLength
    ): string {
        $counter = 1;

        do {
            $suffix = '-'.$counter++;
            $slug = self::truncate(
                $base,
                $maxLength - strlen($suffix)
            ).$suffix;
        } while (! self::isAvailable($slug, $table, $column));

        return $slug;
    }

    /**
     * Check if slug exists in DB.
     */
    public static function isAvailable(
        string $slug,
        string $table,
        string $column
    ): bool {
        return ! DB::table($table)
            ->where($column, $slug)
            ->exists();
    }

    /**
     * Validate slug format.
     */
    public static function isValid(string $slug): bool
    {
        return (bool) preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug);
    }

    /**
     * Generate random slug.
     */
    public static function random(int $length = 8): string
    {
        return Str::lower(Str::random($length));
    }

    /**
     * Suggest alternative slugs.
     */
    public static function suggest(
        string $source,
        string $table,
        string $column = 'slug',
        int $count = 5
    ): array {
        $base = self::sanitize($source);
        $suggestions = [];

        for ($i = 0; count($suggestions) < $count; $i++) {
            $candidate = $base.'-'.rand(10, 999);

            if (self::isAvailable($candidate, $table, $column)) {
                $suggestions[] = $candidate;
            }
        }

        return $suggestions;
    }

    /**
     * Truncate slug safely.
     */
    public static function truncate(string $slug, int $maxLength): string
    {
        return Str::limit($slug, $maxLength, '');
    }

    /**
     * Update slug only if source changed.
     */
    public static function updateIfChanged(
        string $newSource,
        string $oldSource,
        string $currentSlug,
        string $table,
        string $column = 'slug'
    ): string {
        if ($newSource === $oldSource) {
            return $currentSlug;
        }

        return self::create($newSource, $table, $column);
    }
}
