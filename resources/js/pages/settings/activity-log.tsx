import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { activityLog, dashboard } from '@/routes';
import { BreadcrumbItem, PaginatedActivityLogs, ActivityLog as ActivityLogType } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Activity Log',
        href: activityLog().url,
    },
];

interface QueryParams {
    search?: string;
    resource_type?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: string;
    [key: string]: any;
}

interface Props {
    activities: PaginatedActivityLogs;
    query_params?: QueryParams;
}

const ActivityLog = ({ activities, query_params = {} }: Props) => {
    const queryParams: QueryParams = query_params || {};

    const [search, setSearch] = useState(queryParams.search ?? '');
    const [resourceType, setResourceType] = useState(queryParams.resource_type ?? '');
    const [sortBy, setSortBy] = useState(queryParams.sort_by ?? 'created_at');
    const [sortOrder, setSortOrder] = useState(queryParams.sort_order ?? 'desc');
    const [perPage, setPerPage] = useState(queryParams.per_page ?? '10');
    const [isInitial, setIsInitial] = useState(true);

    // Get unique resource types from current data
    const resourceTypes = Array.from(
        new Set(activities.data.map((item) => item.resource_type))
    ).sort();

    const applyFilters = (
        newSearch?: string,
        newResourceType?: string,
        newSortBy?: string,
        newSortOrder?: string,
        newPerPage?: string
    ) => {
        const searchValue = newSearch !== undefined ? newSearch : search;
        const typeValue = newResourceType !== undefined ? newResourceType : resourceType;
        const sortByValue = newSortBy !== undefined ? newSortBy : sortBy;
        const sortOrderValue = newSortOrder !== undefined ? newSortOrder : sortOrder;
        const perPageValue = newPerPage !== undefined ? newPerPage : perPage;

        router.get(
            activityLog().url,
            {
                search: searchValue,
                resource_type: typeValue,
                sort_by: sortByValue,
                sort_order: sortOrderValue,
                per_page: perPageValue,
            },
            { preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setResourceType('');
        setSortBy('created_at');
        setSortOrder('desc');
        setPerPage('10');

        router.get(activityLog().url, {}, { preserveScroll: true });
    };

    const toggleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'desc' ? 'asc' : 'desc';
        
        setSortBy(column);
        setSortOrder(newSortOrder);
        setTimeout(() => {
            applyFilters(undefined, undefined, column, newSortOrder, undefined);
        }, 0);
    };

    // Skip initial render, only apply filters after user interaction
    useEffect(() => {
        if (isInitial) {
            setIsInitial(false);
            return;
        }

        const timer = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Apply filters when resource type changes
    useEffect(() => {
        if (isInitial) return;
        applyFilters();
    }, [resourceType]);

    // Apply filters when per_page changes
    useEffect(() => {
        if (isInitial) return;
        applyFilters();
    }, [perPage]);

    const getActionBadgeColor = (action: string) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('create')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        if (actionLower.includes('update')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        if (actionLower.includes('delete')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortBy !== column) return <ChevronDown className="h-4 w-4 opacity-40" />;
        return sortOrder === 'desc' ? (
            <ChevronDown className="h-4 w-4" />
        ) : (
            <ChevronUp className="h-4 w-4" />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log" />

            <h1 className="sr-only">Activity Log</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Activity Log</h2>
                            <p className="text-muted-foreground mt-1">
                                Track and monitor all your account activities
                            </p>
                        </div>

                        {/* Search and Filters Section */}
                        <div className="space-y-4">
                            {/* Search Input */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                <div className="flex-1 min-w-0">
                                    <label htmlFor="search" className="block text-sm font-medium mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            type="text"
                                            placeholder="Search by action, resource, or IP..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        className="flex-1"
                                        title="Reset filters"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="grid grid-cols-1 gap-4 items-center sm:grid-cols-3">
                                {/* Resource Type Filter */}
                                <div>
                                    <label htmlFor="resource-type" className="block text-sm font-medium mb-2">
                                        <Filter className="inline h-4 w-4 mr-2" />
                                        Resource Type
                                    </label>
                                    <Select value={resourceType} onValueChange={setResourceType}>
                                        <SelectTrigger id="resource-type">
                                            <SelectValue placeholder="All resources" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All resources</SelectItem>
                                            {resourceTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label htmlFor="per-page" className="block text-sm font-medium mb-2">
                                        Results Per Page
                                    </label>
                                    <Select value={perPage} onValueChange={setPerPage}>
                                        <SelectTrigger id="per-page">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10 per page</SelectItem>
                                            <SelectItem value="25">25 per page</SelectItem>
                                            <SelectItem value="50">50 per page</SelectItem>
                                            <SelectItem value="100">100 per page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            {(search || resourceType) && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {search && (
                                        <Badge variant="secondary" className="gap-1">
                                            Search: {search}
                                        </Badge>
                                    )}
                                    {resourceType && (
                                        <Badge variant="secondary" className="gap-1">
                                            Type: {resourceType}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="rounded-lg border bg-card overflow-hidden">
                        {activities.data.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-muted-foreground text-lg">
                                    No activities found. Try adjusting your filters.
                                </p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableHead
                                                className="cursor-pointer select-none hover:bg-muted transition-colors"
                                                onClick={() => toggleSort('action')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Action
                                                    <SortIcon column="action" />
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none hover:bg-muted transition-colors"
                                                onClick={() => toggleSort('resource_type')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Resource Type
                                                    <SortIcon column="resource_type" />
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none hover:bg-muted transition-colors"
                                                onClick={() => toggleSort('resource_id')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Resource ID
                                                    <SortIcon column="resource_id" />
                                                </div>
                                            </TableHead>
                                            <TableHead className="hidden sm:table-cell">IP Address</TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none hover:bg-muted transition-colors text-right"
                                                onClick={() => toggleSort('created_at')}
                                            >
                                                <div className="flex items-center justify-end gap-2">
                                                    Date
                                                    <SortIcon column="created_at" />
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activities.data.map((activity: ActivityLogType) => (
                                            <TableRow
                                                key={activity.id}
                                                className="hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell>
                                                    <Badge
                                                        className={`${getActionBadgeColor(
                                                            activity.action
                                                        )} font-semibold`}
                                                    >
                                                        {activity.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {activity.resource_type}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                                        #{activity.resource_id}
                                                    </code>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-sm">
                                                    {activity.ip_address ? (
                                                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                                            {activity.ip_address}
                                                        </code>
                                                    ) : (
                                                        <span className="text-muted-foreground">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {formatDate(activity.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination Section */}
                                <div className="border-t bg-muted/30 px-4 py-4 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            Showing{' '}
                                            <span className="font-semibold">{activities.from}</span> to{' '}
                                            <span className="font-semibold">{activities.to}</span> of{' '}
                                            <span className="font-semibold">{activities.total}</span> activities
                                        </p>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!activities.prev_page_url}
                                                onClick={() => {
                                                    if (activities.prev_page_url) {
                                                        router.visit(activities.prev_page_url, {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>

                                            {/* Page Numbers */}
                                            <div className="hidden sm:flex items-center gap-1">
                                                {activities.links.map((link, index) => {
                                                    if (!link.label) return null;

                                                    const isEllipsis = link.label === '...';
                                                    const isActive = link.active;

                                                    if (isEllipsis) {
                                                        return (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 text-muted-foreground"
                                                            >
                                                                {link.label}
                                                            </span>
                                                        );
                                                    }

                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant={isActive ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => {
                                                                if (link.url) {
                                                                    router.visit(link.url, {
                                                                        preserveScroll: true,
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            {link.label}
                                                        </Button>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!activities.next_page_url}
                                                onClick={() => {
                                                    if (activities.next_page_url) {
                                                        router.visit(activities.next_page_url, {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default ActivityLog;
