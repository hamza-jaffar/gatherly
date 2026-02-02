import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BreadcrumbItem, Pagination as PaginationType } from '@/types';
import { Plus } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import spaceRoute from '@/routes/space';
import { SpaceCard } from '@/components/spaces/space-card';
import { SpaceFilters } from '@/components/spaces/space-filters';
import { SpaceGridSkeleton } from '@/components/spaces/space-grid-skeleton';
import axios from 'axios';
import { Space } from '@/types/space';

interface Props {
    spaces: PaginationType<Space>;
    filters: {
        search?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Spaces',
        href: spaceRoute.index().url,
    },
];

export default function SpaceIndex({ spaces: initialSpaces, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    // Mapping sort_by+sort_dir to a simplified sort value for the UI (default: recent)
    const [sort, setSort] = useState(() => {
        if (filters.sort_by === 'created_at' && filters.sort_dir === 'desc')
            return 'newest';
        if (filters.sort_by === 'created_at' && filters.sort_dir === 'asc')
            return 'oldest';
        if (filters.sort_by === 'name' && filters.sort_dir === 'asc')
            return 'alphabetical';
        return 'recent'; // Default or other cases
    });

    const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

    // Infinite Scroll State
    const [spaces, setSpaces] = useState<Space[]>(initialSpaces.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        initialSpaces.links.find((l) => l.label === 'Next &raquo;')?.url ||
            null,
    );
    const [loadingMore, setLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Reset spaces when initialSpaces changes (e.g. Filter applied)
    useEffect(() => {
        setSpaces(initialSpaces.data);
        const nextLink = initialSpaces.links.find(
            (l) => l.label === 'Next &raquo;',
        );
        setNextPageUrl(nextLink?.url || null);
    }, [initialSpaces]);

    // Debounce search and update Filters
    useEffect(() => {
        const timer = setTimeout(() => {
            // Check if search or sort actually changed from props to avoid redundant reload on mount
            const currentSortBy = filters.sort_by;
            const currentSortDir = filters.sort_dir;

            // Map UI sort to backend params
            let sortBy = 'updated_at';
            let sortDir = 'desc';

            if (sort === 'newest') {
                sortBy = 'created_at';
                sortDir = 'desc';
            } else if (sort === 'oldest') {
                sortBy = 'created_at';
                sortDir = 'asc';
            } else if (sort === 'alphabetical') {
                sortBy = 'name';
                sortDir = 'asc';
            }
            // 'recent' stays updated_at desc

            if (
                search !== filters.search ||
                sortBy !== currentSortBy ||
                sortDir !== currentSortDir
            ) {
                router.get(
                    spaceRoute.index().url,
                    { search: search, sort_by: sortBy, sort_dir: sortDir },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, sort]);

    // Infinite Scroll Implementation
    const loadMore = useCallback(async () => {
        if (!nextPageUrl || loadingMore) return;

        setLoadingMore(true);
        try {
            // Force JSON response to ensure we get the data structure we want
            const response = await axios.get(nextPageUrl, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            let newSpaces: Space[] = [];
            let newNextUrl: string | null = null;

            const resData = response.data;

            if (resData.props && resData.props.spaces) {
                // Inertia Page Object Response
                const spacesData = resData.props.spaces;
                newSpaces = spacesData.data || [];
                newNextUrl = spacesData.next_page_url || null;

                // Sometimes links are used instead of next_page_url top-level
                if (!newNextUrl && spacesData.links) {
                    const nextLink = spacesData.links.find(
                        (l: any) =>
                            l.label && l.label.includes('Next') && l.url,
                    );
                    newNextUrl = nextLink ? nextLink.url : null;
                }
            } else if (resData.data && Array.isArray(resData.data)) {
                // Standard API Response (Laravel Resource)
                newSpaces = resData.data;
                newNextUrl =
                    resData.next_page_url ||
                    (resData.links?.next as string) ||
                    null;
            } else if (resData.spaces && resData.spaces.data) {
                // Direct Props Wrapping (if returned directly)
                newSpaces = resData.spaces.data;
                newNextUrl = resData.spaces.next_page_url;
            }

            if (newSpaces.length > 0) {
                setSpaces((prev) => {
                    const existingIds = new Set(prev.map((s) => s.id));
                    const uniqueNewSpaces = newSpaces.filter(
                        (s) => !existingIds.has(s.id),
                    );
                    return [...prev, ...uniqueNewSpaces];
                });
                setNextPageUrl(newNextUrl);
            } else {
                setNextPageUrl(null); // No more data found
            }
        } catch (error) {
            console.error('Failed to load more spaces', error);
            // Optional: Show error toast here
        } finally {
            setLoadingMore(false);
        }
    }, [nextPageUrl, loadingMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 1.0 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMore]);

    const confirmDelete = () => {
        if (deleteSlug) {
            router.delete(spaceRoute.destroy(deleteSlug).url, {
                onFinish: () => setDeleteSlug(null),
                onSuccess: () => {
                    // Remove from local state immediately for snappy feel
                    setSpaces(spaces.filter((s) => s.slug !== deleteSlug));
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Spaces" />

            <div className="flex h-full w-full flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Spaces
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your shared workspaces and collaborate with
                            your team.
                        </p>
                    </div>
                    <Link href={spaceRoute.create().url}>
                        <Button
                            size="lg"
                            className="w-full shadow-sm sm:w-auto"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Create Space
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <SpaceFilters
                    search={search}
                    onSearchChange={setSearch}
                    sort={sort}
                    onSortChange={setSort}
                />

                {/* Grid Content */}
                {spaces.length === 0 && !loadingMore ? (
                    <div className="flex h-64 animate-in flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center duration-500 zoom-in-95 fade-in">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">
                            No spaces found
                        </h3>
                        <p className="mb-4 max-w-sm text-muted-foreground">
                            Get started by creating a new space or adjusting
                            your search filters.
                        </p>
                        <Link href={spaceRoute.create().url}>
                            <Button variant="outline">Create Space</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid animate-in grid-cols-1 gap-6 duration-700 fade-in sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {spaces.map((space) => (
                            <SpaceCard
                                key={space.id}
                                space={space}
                                onDelete={setDeleteSlug}
                            />
                        ))}
                    </div>
                )}

                {/* Infinite Scroll Sentinel / Loading State */}
                <p className="text-center text-muted-foreground">
                    You have {spaces.length} spaces
                </p>
                <div
                    ref={observerTarget}
                    className="flex w-full flex-col items-center justify-center"
                >
                    {loadingMore ? (
                        <SpaceGridSkeleton />
                    ) : (
                        nextPageUrl && (
                            <Button
                                variant="ghost"
                                onClick={loadMore}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Load more spaces
                            </Button>
                        )
                    )}
                </div>
            </div>

            <AlertDialog
                open={!!deleteSlug}
                onOpenChange={() => setDeleteSlug(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the space and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
