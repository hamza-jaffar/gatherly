import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    MoreVertical,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Loader2,
    Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Item {
    id: number;
    title: string;
    description: string | null;
    type: 'TASK' | 'NOTE';
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | null;
    due_date: string | null;
    space_id: number;
}

interface ItemCardProps {
    item: Item;
    spaceSlug: string;
}

const statusConfig = {
    TODO: { color: 'bg-slate-500', icon: Circle, label: 'Todo' },
    IN_PROGRESS: { color: 'bg-blue-500', icon: Clock, label: 'In Progress' },
    REVIEW: { color: 'bg-yellow-500', icon: Loader2, label: 'Review' },
    DONE: { color: 'bg-green-500', icon: CheckCircle2, label: 'Done' },
};

export default function ItemCard({ item, spaceSlug }: ItemCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateStatus = (newStatus: Item['status']) => {
        if (item.status === newStatus) return;

        router.put(
            `/spaces/${spaceSlug}/items/${item.id}`,
            { status: newStatus },
            {
                onStart: () => setIsUpdating(true),
                onFinish: () => setIsUpdating(false),
                onSuccess: () => toast.success('Status updated'),
                onError: () => toast.error('Failed to update status'),
                preserveScroll: true,
            },
        );
    };

    const deleteItem = () => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        router.delete(`/spaces/${spaceSlug}/items/${item.id}`, {
            onSuccess: () => toast.success('Item deleted'),
            onError: () => toast.error('Failed to delete item'),
            preserveScroll: true,
        });
    };

    const StatusIcon = item.status ? statusConfig[item.status].icon : null;

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    item.type === 'TASK'
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="text-[10px] tracking-wider uppercase"
                            >
                                {item.type}
                            </Badge>
                            {item.type === 'TASK' && item.status && (
                                <Badge
                                    className={`${statusConfig[item.status].color} text-[10px] tracking-wider text-white uppercase`}
                                >
                                    {statusConfig[item.status].label}
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-lg leading-tight font-bold decoration-primary/30 decoration-2 group-hover:underline">
                            {item.title}
                        </CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {item.type === 'TASK' && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => updateStatus('TODO')}
                                    >
                                        Set to Todo
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            updateStatus('IN_PROGRESS')
                                        }
                                    >
                                        Set to In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => updateStatus('REVIEW')}
                                    >
                                        Set to Review
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => updateStatus('DONE')}
                                    >
                                        Set to Done
                                    </DropdownMenuItem>
                                    <div className="my-1 border-t" />
                                </>
                            )}
                            <DropdownMenuItem
                                onClick={deleteItem}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3 text-sm whitespace-pre-wrap text-muted-foreground">
                    {item.description || 'No description provided.'}
                </p>
            </CardContent>
            <CardFooter className="pt-0">
                <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    {item.due_date ? (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                                {format(new Date(item.due_date), 'MMM d, yyyy')}
                            </span>
                        </div>
                    ) : (
                        <div />
                    )}
                    {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
            </CardFooter>
        </Card>
    );
}
