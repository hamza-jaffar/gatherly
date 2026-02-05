import { User } from './auth';

export interface SpaceVisit {
    id: number;
    visit_count: number;
    last_seen_at: string;
}

export interface Space {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_private: boolean;
    owner: User;
    created_at: string;
    updated_at: string;
    created_by: number;
    members_count?: number;
    users_count?: number;
    last_activity_at?: string;
    users?: User[];
    visits?: SpaceVisit[];
    can?: {
        update: boolean;
        delete: boolean;
        manageMembers: boolean;
        createItem: boolean;
    };
}

export interface Item {
    id: number;
    title: string;
    description: string | null;
    type: 'TASK' | 'NOTE';
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | null;
    due_date: string | null;
    slug: string;
    space_id: number;
    can?: {
        update: boolean;
        delete: boolean;
    };
    owner: User;
}
