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
    owner: User;
    members_count?: number;
    last_activity_at?: string;
    visits?: SpaceVisit[];
}
