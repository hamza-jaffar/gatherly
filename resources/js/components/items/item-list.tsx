import ItemCard from './item-card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Filter } from 'lucide-react';
import { router } from '@inertiajs/react';

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
    onAddItemClick: () => void;
    filters?: {
        type?: string;
        status?: string;
    };
}

export default function ItemList({
    items,
    spaceSlug,
    onAddItemClick,
    filters,
}: ItemListProps) {
    const filterType = filters?.type || 'ALL';
    const filterStatus = filters?.status || 'ALL';

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === 'ALL') delete newFilters[key as keyof typeof newFilters];

        // Reset status if type changes to ALL or NOTE
        if (key === 'type' && (value === 'ALL' || value === 'NOTE')) {
            delete newFilters.status;
        }

        router.get(`/spaces/${spaceSlug}/items`, newFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ['items', 'filters'],
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        <span>Filter by:</span>
                    </div>
                    <Select
                        value={filterType}
                        onValueChange={(v) => handleFilterChange('type', v)}
                    >
                        <SelectTrigger className="h-8 w-[130px] text-xs">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="TASK">Tasks</SelectItem>
                            <SelectItem value="NOTE">Notes</SelectItem>
                        </SelectContent>
                    </Select>

                    {filterType === 'TASK' && (
                        <Select
                            value={filterStatus}
                            onValueChange={(v) =>
                                handleFilterChange('status', v)
                            }
                        >
                            <SelectTrigger className="h-8 w-[130px] text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="TODO">Todo</SelectItem>
                                <SelectItem value="IN_PROGRESS">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="REVIEW">Review</SelectItem>
                                <SelectItem value="DONE">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div> */}

                <Button
                    onClick={onAddItemClick}
                    size="sm"
                    className="ml-auto h-8 gap-1"
                >
                    <Plus className="h-4 w-4" />
                    New Item
                </Button>
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            spaceSlug={spaceSlug}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No items yet</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Create your first task or note to get started in this
                        space.
                    </p>
                    <Button onClick={onAddItemClick} variant="outline">
                        Create your first item
                    </Button>
                </div>
            )}
        </div>
    );
}
