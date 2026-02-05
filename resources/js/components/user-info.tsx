import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { mergeNames } from '@/lib/utils';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                    src={`/storage/${user.avatar}`}
                    alt={mergeNames(user.first_name, user.last_name)}
                />
                <AvatarFallback className="bg-primary/5 text-xs font-bold text-primary">
                    {getInitials(mergeNames(user.first_name, user.last_name))}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                    {mergeNames(user.first_name, user.last_name)}
                </span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
