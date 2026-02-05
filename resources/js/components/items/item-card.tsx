import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
    STATUS_CONFIG,
    STICKY_NOTE_COLORS,
} from '../../../contants/item-colors';
import { Item } from '@/types/space';
import { UserInfo } from '../user-info';

interface ItemCardProps {
    item: Item;
    spaceSlug: string;
}

export default function ItemCard({ item, spaceSlug }: ItemCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    console.log(item);

    const updateStatus = (newStatus: Item['status']) => {
        if (item.status === newStatus) return;

        router.put(
            `/spaces/${spaceSlug}/items/${item.id}`,
            { status: newStatus },
            {
                onStart: () => setIsUpdating(true),
                onFinish: () => setIsUpdating(false),
                onSuccess: () => {},
                onError: () => {},
                preserveScroll: true,
            },
        );
    };

    const deleteItem = () => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        router.delete(`/spaces/${spaceSlug}/items/${item.id}`, {
            onSuccess: () => {},
            onError: () => {},
            preserveScroll: true,
        });
    };

    const isNote = item.type === 'NOTE';

    // Deterministic styles based on ID
    const { color, rotation } = useMemo(() => {
        const colorIdx = item.id % STICKY_NOTE_COLORS.length;
        const rotations = [
            'rotate-1',
            '-rotate-1',
            'rotate-2',
            '-rotate-2',
            'rotate-0',
        ];
        const rotClass = rotations[item.id % rotations.length];
        return {
            color: STICKY_NOTE_COLORS[colorIdx],
            rotation: rotClass,
        };
    }, [item.id]);

    if (isNote) {
        return (
            <div
                className={`group relative cursor-pointer p-8 transition-all duration-500 ${color.bg} ${color.border} border-r border-b ${rotation} flex min-h-[220px] flex-col shadow-[10px_10px_30px_rgba(0,0,0,0.1)] hover:z-20 hover:-translate-y-2 hover:rotate-0 hover:shadow-[20px_20px_40px_rgba(0,0,0,0.15)]`}
            >
                {/* Subtle Paper Texture Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.03]" />

                {/* 3D Push-pin */}
                <div className="absolute top-[-14px] left-1/2 z-30 -translate-x-1/2 transition-transform group-hover:scale-110">
                    {/* Pin Head */}
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),2px_4px_6px_rgba(0,0,0,0.2)]">
                        <div className="-mt-1 -ml-1 h-2 w-2 rounded-full border border-white/10 bg-white/30" />
                    </div>
                    {/* Pin Spike Shadow */}
                    <div className="mx-auto -mt-[2px] h-3 w-1 bg-black/20 blur-[1px]" />
                </div>

                {/* Realistic Folded Corner */}
                <div className="pointer-events-none absolute right-0 bottom-0 z-10 h-12 w-12">
                    {/* Dark triangle for the shadow underneath the fold */}
                    <div
                        className="absolute right-0 bottom-0 h-full w-full bg-black/15"
                        style={{
                            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                        }}
                    />
                    {/* The folded part of the paper */}
                    <div
                        className="absolute right-0 bottom-0 h-full w-full bg-white/40 backdrop-blur-[2px]"
                        style={{
                            clipPath: 'polygon(0 100%, 100% 0, 0 0)',
                            transform: 'rotate(180deg)',
                            boxShadow: '-2px -2px 10px rgba(0,0,0,0.1)',
                        }}
                    />
                </div>

                <div className="relative z-10 mb-4 flex items-start justify-between">
                    <h3
                        className={`font-serif text-2xl leading-tight font-bold italic ${color.text}`}
                    >
                        {item.title}
                    </h3>
                    {item.can?.delete && (
                        <button
                            className="cursor-pointer text-red-500 hover:text-red-800"
                            onClick={deleteItem}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <p
                    className={`relative z-10 line-clamp-6 grow font-serif text-xl leading-relaxed italic ${color.text} opacity-90`}
                >
                    {item.description}
                </p>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                    <div className="flex items-center gap-2">
                        <UserInfo user={item.owner} />
                    </div>
                    {/* Subtle paper texture hint */}
                    <span
                        className={`text-[11px] font-black tracking-widest uppercase opacity-30 ${color.text}`}
                    >
                        Note No. {item.id}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                    {item.status && (
                        <Badge
                            className={`${STATUS_CONFIG[item.status].color} border-none text-[10px] font-bold tracking-wider uppercase`}
                        >
                            {STATUS_CONFIG[item.status].label}
                        </Badge>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer text-slate-400 hover:text-slate-600"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {item.can?.update && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => updateStatus('TODO')}
                                >
                                    Mark as Todo
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateStatus('IN_PROGRESS')}
                                >
                                    Mark as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateStatus('REVIEW')}
                                >
                                    Mark as Review
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateStatus('DONE')}
                                >
                                    Mark as Done
                                </DropdownMenuItem>
                            </>
                        )}
                        {item.can?.delete && (
                            <>
                                <div className="my-1 border-t" />
                                <DropdownMenuItem
                                    onClick={deleteItem}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-primary">
                    {item.title}
                </h3>

                {item.description && (
                    <p className="line-clamp-4 text-sm leading-relaxed text-slate-600">
                        {item.description}
                    </p>
                )}

                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                    {item.due_date ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {format(new Date(item.due_date), 'MMM d, yyyy')}
                            </span>
                        </div>
                    ) : (
                        <div />
                    )}

                    {isUpdating && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                </div>
            </div>
        </div>
    );
}
