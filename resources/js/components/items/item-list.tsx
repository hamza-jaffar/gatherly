import ItemCard from './item-card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Filter, ArrowRight } from 'lucide-react';
import { router, Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

interface Item {
    id: number;
    title: string;
    description: string | null;
    type: 'TASK' | 'NOTE';
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | null;
    due_date: string | null;
    space_id: number;
}

interface ItemListProps {
    items: Item[];
    spaceSlug: string;
    onAddItemClick?: () => void;
    filters?: {
        type?: string;
        status?: string;
    };
    variant?: 'summary' | 'full';
}

export default function ItemList({
    items,
    spaceSlug,
    onAddItemClick,
    filters,
    variant = 'full',
}: ItemListProps) {
    const { auth } = usePage<SharedData>().props;

    /* ----------------------------------
     * SUMMARY VARIANT (Space overview)
     * ---------------------------------- */
    if (variant === 'summary') {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                        Recent items
                    </h3>
                    <Link
                        href={`/spaces/${spaceSlug}/items`}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                        View all
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {items.length > 0 ? (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium">
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.type}
                                        {item.status && ` • ${item.status}`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            No items created yet
                        </p>
                    </div>
                )}
            </div>
        );
    }

    /* ----------------------------------
     * FULL VARIANT (Items workspace)
     * ---------------------------------- */

    const filterType = filters?.type || 'ALL';
    const filterStatus = filters?.status || 'ALL';

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };

        if (value === 'ALL') delete newFilters[key as keyof typeof newFilters];
        if (key === 'type' && value !== 'TASK') delete newFilters.status;

        router.get(`/spaces/${spaceSlug}/items`, newFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ['items', 'filters'],
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Items</h2>
                    <p className="text-sm text-muted-foreground">
                        Tasks and notes inside this space
                    </p>
                </div>

                {auth.user && onAddItemClick && (
                    <Button
                        onClick={onAddItemClick}
                        size="sm"
                        className="h-8 gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        New item
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    Filter
                </div>

                <Select
                    value={filterType}
                    onValueChange={(v) => handleFilterChange('type', v)}
                >
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All types</SelectItem>
                        <SelectItem value="TASK">Tasks</SelectItem>
                        <SelectItem value="NOTE">Notes</SelectItem>
                    </SelectContent>
                </Select>

                {filterType === 'TASK' && (
                    <Select
                        value={filterStatus}
                        onValueChange={(v) => handleFilterChange('status', v)}
                    >
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All status</SelectItem>
                            <SelectItem value="TODO">Todo</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                                In progress
                            </SelectItem>
                            <SelectItem value="REVIEW">Review</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Items */}
            {items.length > 0 ? (
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {items.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            spaceSlug={spaceSlug}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                    <h3 className="text-lg font-semibold">No items yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Start by creating a task or a note for this space.
                    </p>

                    {onAddItemClick && (
                        <Button
                            onClick={onAddItemClick}
                            variant="outline"
                            className="mt-6"
                        >
                            Create your first item
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
