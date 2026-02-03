export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type Flash = {
    success: string;
    error: string;
};

export type Pagination<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    next_page_url?: string | null;
    prev_page_url?: string | null;
};

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    flash: Flash;
    [key: string]: unknown;
};
