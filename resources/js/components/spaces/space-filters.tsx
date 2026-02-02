import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SpaceFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    sort: string;
    onSortChange: (value: string) => void;
}

export function SpaceFilters({
    search,
    onSearchChange,
    sort,
    onSortChange,
}: SpaceFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search spaces..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Recently Active</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="alphabetical">Name (A-Z)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
