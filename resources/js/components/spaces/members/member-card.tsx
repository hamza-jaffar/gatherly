import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Shield, UserMinus, UserCheck } from 'lucide-react';
import { MemberRoleBadge } from './member-role-badge';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Member {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    pivot: {
        role: string;
        joined_at: string;
    };
}

interface MemberCardProps {
    member: Member;
    spaceSlug: string;
    isOwner: boolean;
    currentUserIsAdmin: boolean;
}

export function MemberCard({
    member,
    spaceSlug,
    isOwner,
    currentUserIsAdmin,
}: MemberCardProps) {
    const updateRole = (role: string) => {
        router.put(
            `/spaces/${spaceSlug}/members/${member.id}`,
            { role },
            {
                onSuccess: () => toast.success('Role updated'),
                preserveScroll: true,
            },
        );
    };

    const removeMember = () => {
        if (
            confirm(
                `Are you sure you want to remove ${member.first_name} from this space?`,
            )
        ) {
            router.delete(`/spaces/${spaceSlug}/members/${member.id}`, {
                onSuccess: () => toast.success('Member removed'),
                preserveScroll: true,
            });
        }
    };

    const name = `${member.first_name} ${member.last_name}`;
    const initials = `${member.first_name[0]}${member.last_name[0]}`;

    return (
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-all hover:bg-muted/50">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback className="bg-primary/5 text-xs font-bold text-primary">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{name}</span>
                        {isOwner && (
                            <Badge
                                variant="secondary"
                                className="h-4 border-amber-100 bg-amber-50 px-1.5 text-[10px] font-bold tracking-tighter text-amber-600 uppercase"
                            >
                                Owner
                            </Badge>
                        )}
                        <MemberRoleBadge role={member.pivot.role} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {member.email}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {!isOwner && currentUserIsAdmin && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer hover:bg-muted"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Manage Member</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="px-2 pt-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase">
                                Change Role
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => updateRole('admin')}
                                className="gap-2"
                            >
                                <Shield className="h-3.5 w-3.5 text-rose-500" />{' '}
                                Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateRole('editor')}
                                className="gap-2"
                            >
                                <UserCheck className="h-3.5 w-3.5 text-blue-500" />{' '}
                                Editor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateRole('member')}
                                className="gap-2"
                            >
                                <UserCheck className="h-3.5 w-3.5 text-indigo-500" />{' '}
                                Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateRole('viewer')}
                                className="gap-2"
                            >
                                <UserCheck className="h-3.5 w-3.5 text-slate-500" />{' '}
                                Viewer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={removeMember}
                                className="gap-2 text-destructive"
                            >
                                <UserMinus className="h-3.5 w-3.5" /> Remove
                                Member
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

const Badge = ({ children, variant, className }: any) => (
    <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none ${className}`}
    >
        {children}
    </span>
);
