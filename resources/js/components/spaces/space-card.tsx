import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import spaceRoute from '@/routes/space';
import { Link } from '@inertiajs/react';
import {
    Clock,
    Eye,
    MoreHorizontal,
    Pen,
    Share,
    Share2,
    Trash,
    Users,
} from 'lucide-react';
import { UserInfo } from '../user-info';
import { Space } from '@/types/space';
import SharedModal from './shared-modal';
import { useState } from 'react';

interface SpaceCardProps {
    space: Space;
    onDelete?: (slug: string) => void;
}

export function SpaceCard({ space, onDelete }: SpaceCardProps) {
    const lastActive = space.last_activity_at
        ? new Date(space.last_activity_at).toLocaleDateString()
        : new Date(space.created_at).toLocaleDateString();

    const [openSharedModal, setOpenSharedModal] = useState(false);
    const [shareUrl, setShareUrl] = useState<string>('');

    const handleShareClick = () => {
        const baseUrl = `${window.location.origin}${spaceRoute.show(space.slug).url}`;
        const visitorId = crypto.randomUUID();
        setShareUrl(`${baseUrl}?vid=${visitorId}`);
        setOpenSharedModal(true);
    };

    return (
        <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card py-0! transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
            {/* Clickable Area Overlay */}
            <Link
                href={spaceRoute.show(space.slug).url}
                className="absolute inset-0 z-0"
                aria-label={`View ${space.name}`}
            />

            <CardHeader className="hidden"></CardHeader>

            <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="line-clamp-1 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {space.name}
                </h3>

                <p className="mt-2 line-clamp-2 min-h-[40px] flex-1 text-sm text-muted-foreground">
                    {space.description || 'No description provided.'}
                </p>

                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2.5 py-1">
                            <Users className="h-3.5 w-3.5" />
                            <span className="font-medium">
                                {space.members_count || 1}
                            </span>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-1.5"
                        title="Last active"
                    >
                        <Clock className="h-3.5 w-3.5" />
                        <span>{lastActive}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="z-10 flex items-center justify-between border-t bg-muted/30 p-4">
                <div className="flex items-center gap-2.5">
                    <UserInfo user={space.owner} />
                </div>

                <div className="flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer text-muted-foreground transition-all hover:bg-background hover:text-foreground hover:shadow-sm"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <Link href={spaceRoute.show(space.slug).url}>
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> View Space
                                </DropdownMenuItem>
                            </Link>
                            <Link href={spaceRoute.edit(space.slug).url}>
                                <DropdownMenuItem>
                                    <Pen className="mr-2 h-4 w-4" /> Edit Space
                                </DropdownMenuItem>
                            </Link>
                            {onDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => onDelete(space.slug)}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />{' '}
                                        Delete Space
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div
                        onClick={handleShareClick}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-background hover:text-foreground hover:shadow-sm"
                    >
                        <Share2 className="h-4 w-4" />
                    </div>
                    {openSharedModal && (
                        <SharedModal
                            open={openSharedModal}
                            setOpen={setOpenSharedModal}
                            url={shareUrl}
                            title={space.name}
                        />
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
