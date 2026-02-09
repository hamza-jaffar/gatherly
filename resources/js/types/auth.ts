export type User = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    avatar?: string;
    email: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type Notification = {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    read_at: string;
    type: string;
    receiver_id: number;
    sender_id: number;
    created_at: string;
    updated_at: string;
};
