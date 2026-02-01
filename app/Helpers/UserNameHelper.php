<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserNameHelper
{
    /**
     * Main entry: create a unique username from a name or email.
     */
    public static function create(
        string $source,
        string $table = 'users',
        string $column = 'username',
        int $maxLength = 30
    ): string {
        $base = self::sanitize($source);
        $base = self::truncate($base, $maxLength);

        if (self::isAvailable($base, $table, $column)) {
            return $base;
        }

        return self::makeUnique($base, $table, $column, $maxLength);
    }

    /**
     * Sanitize raw input into a valid username.
     */
    public static function sanitize(string $value): string
    {
        $value = Str::ascii($value);
        $value = strtolower($value);
        $value = preg_replace('/[^a-z0-9._]/', '', $value);
        $value = trim($value, '._');

        return $value ?: self::random();
    }

    /**
     * Ensure username uniqueness by appending a number.
     */
    public static function makeUnique(
        string $base,
        string $table,
        string $column,
        int $maxLength
    ): string {
        $counter = 1;

        do {
            $suffix = $counter++;
            $username = self::truncate(
                $base,
                $maxLength - strlen((string) $suffix)
            ).$suffix;
        } while (! self::isAvailable($username, $table, $column));

        return $username;
    }

    /**
     * Check if a username exists in DB.
     */
    public static function isAvailable(
        string $username,
        string $table,
        string $column
    ): bool {
        return ! DB::table($table)
            ->where($column, $username)
            ->exists()
            && ! self::isReserved($username);
    }

    /**
     * Validate username format.
     */
    public static function isValid(string $username): bool
    {
        return (bool) preg_match('/^[a-z0-9](?:[a-z0-9._]{1,28}[a-z0-9])$/', $username)
            && ! self::isReserved($username);
    }

    /**
     * Generate random username.
     */
    public static function random(int $length = 10): string
    {
        return Str::lower(Str::random($length));
    }

    /**
     * Suggest alternative usernames.
     */
    public static function suggest(
        string $base,
        int $count = 5,
        string $table = 'users',
        string $column = 'username'
    ): array {
        $base = self::sanitize($base);
        $suggestions = [];

        for ($i = 0; count($suggestions) < $count; $i++) {
            $candidate = $base.rand(10, 999);

            if (self::isAvailable($candidate, $table, $column)) {
                $suggestions[] = $candidate;
            }
        }

        return $suggestions;
    }

    /**
     * Truncate username safely.
     */
    public static function truncate(string $username, int $maxLength): string
    {
        return Str::limit($username, $maxLength, '');
    }

    /**
     * Reserved usernames.
     */
    public static function isReserved(string $username): bool
    {
        $reserved = [
            'admin', 'root', 'system', 'support',
            'api', 'null', 'undefined', 'me',
        ];

        return in_array($username, $reserved, true);
    }
}
