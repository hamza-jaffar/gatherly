<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileHelper
{
    /**
     * Upload a file to storage.
     */
    public static function upload(
        UploadedFile $file,
        string $directory,
        string $disk = 'public',
        ?string $filename = null
    ): string {
        $filename ??= self::generateFileName($file);

        return $file->storeAs($directory, $filename, $disk);
    }

    /**
     * Upload with automatic date-based directory.
     * Example: uploads/2026/01/
     */
    public static function uploadWithDatePath(
        UploadedFile $file,
        string $baseDir = 'uploads',
        string $disk = 'public'
    ): string {
        $path = $baseDir.'/'.now()->format('Y/m');

        return self::upload($file, $path, $disk);
    }

    /**
     * Delete a file safely.
     */
    public static function delete(
        ?string $path,
        string $disk = 'public'
    ): bool {
        if (! $path || ! Storage::disk($disk)->exists($path)) {
            return false;
        }

        return Storage::disk($disk)->delete($path);
    }

    /**
     * Replace an existing file.
     */
    public static function replace(
        ?string $oldPath,
        UploadedFile $newFile,
        string $directory,
        string $disk = 'public'
    ): string {
        self::delete($oldPath, $disk);

        return self::upload($newFile, $directory, $disk);
    }

    /**
     * Generate a clean, unique filename.
     */
    public static function generateFileName(UploadedFile $file): string
    {
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($name);

        return $slug.'-'.Str::uuid().'.'.$file->getClientOriginalExtension();
    }

    /**
     * Get public URL for a file.
     */
    public static function url(
        ?string $path,
        string $disk = 'public'
    ): ?string {
        if (! $path) {
            return null;
        }

        return Storage::disk($disk)->url($path);
    }

    /**
     * Check if file exists.
     */
    public static function exists(
        string $path,
        string $disk = 'public'
    ): bool {
        return Storage::disk($disk)->exists($path);
    }

    /**
     * Get file size in bytes.
     */
    public static function size(
        string $path,
        string $disk = 'public'
    ): int {
        return Storage::disk($disk)->size($path);
    }

    /**
     * Validate file mime types.
     */
    public static function validateMime(
        UploadedFile $file,
        array $allowedMimes
    ): bool {
        return in_array($file->getMimeType(), $allowedMimes, true);
    }

    /**
     * Validate file size (MB).
     */
    public static function validateSize(
        UploadedFile $file,
        int $maxSizeMb
    ): bool {
        return ($file->getSize() / 1024 / 1024) <= $maxSizeMb;
    }

    /**
     * Create directory if it doesn't exist.
     */
    public static function ensureDirectory(
        string $path,
        string $disk = 'public'
    ): void {
        if (! Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->makeDirectory($path);
        }
    }

    /**
     * Copy file.
     */
    public static function copy(
        string $from,
        string $to,
        string $disk = 'public'
    ): bool {
        return Storage::disk($disk)->copy($from, $to);
    }

    /**
     * Move file.
     */
    public static function move(
        string $from,
        string $to,
        string $disk = 'public'
    ): bool {
        return Storage::disk($disk)->move($from, $to);
    }
}
