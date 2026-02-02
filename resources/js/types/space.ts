import { User } from './auth';

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
}
