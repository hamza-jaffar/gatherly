<?php

namespace App\Enums;

enum NotificationType: string
{
    case SYSTEM = 'SYSTEM';
    case SUCCESS = 'success';
    case WARNING = 'warning';
    case ERROR = 'error';
    case MESSAGE = 'message';
}
