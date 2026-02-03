import { Badge } from '@/components/ui/badge';

interface MemberRoleBadgeProps {
    role: 'admin' | 'editor' | 'member' | 'viewer' | string;
}

export const MemberRoleBadge = ({ role }: MemberRoleBadgeProps) => {
    const config = {
        admin: {
            color: 'bg-rose-100 text-rose-700 border-rose-200',
            label: 'Admin',
        },
        editor: {
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            label: 'Editor',
        },
        member: {
            color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            label: 'Member',
        },
        viewer: {
            color: 'bg-slate-100 text-slate-700 border-slate-200',
            label: 'Viewer',
        },
    };

    const normalizedRole = role.toLowerCase() as keyof typeof config;
    const { color, label } = config[normalizedRole] || config.member;

    return (
        <Badge
            variant="outline"
            className={`${color} px-2 text-[10px] font-semibold tracking-wider uppercase`}
        >
            {label}
        </Badge>
    );
};
