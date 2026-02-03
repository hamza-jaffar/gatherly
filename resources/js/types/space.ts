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
    created_at: string;
    created_by: number;
    owner: User;
    members_count?: number;
    users_count?: number;
    last_activity_at?: string;
    users?: User[];
    visits?: SpaceVisit[];
}
