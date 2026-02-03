import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Space } from '@/types/space';
import { BreadcrumbItem, SharedData, Pagination } from '@/types';
import spaceRoute from '@/routes/space';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, ChevronLeft, Loader2 } from 'lucide-react';
import { MemberCard } from '@/components/spaces/members/member-card';
import { InviteMemberDialog } from '@/components/spaces/members/invite-member-dialog';
import axios from 'axios';

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

interface Props {
    space: Space;
    members: Pagination<Member>;
    filters: {
        search?: string;
    };
    can: {
        manageMembers: boolean;
    };
}

export default function SpaceMembersIndex({
    space,
    members: initialMembers,
    filters,
    can,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');

    // Member State
    const [membersList, setMembersList] = useState(initialMembers.data);
    const [nextPageUrl, setNextPageUrl] = useState(
        initialMembers.next_page_url,
    );
    const [loadingMore, setLoadingMore] = useState(false);

    // Sync searching with filters
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    `/spaces/${space.slug}/members`,
                    { search },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search, space.slug, filters.search]);

    // Update list on navigation/props change
    useEffect(() => {
        setMembersList(initialMembers.data);
        setNextPageUrl(initialMembers.next_page_url);
    }, [initialMembers]);

    const loadMore = useCallback(async () => {
        if (!nextPageUrl || loadingMore) return;

        setLoadingMore(true);
        try {
            const response = await axios.get(nextPageUrl, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = response.data;
            if (data.data) {
                setMembersList((prev) => [...prev, ...data.data]);
                setNextPageUrl(data.next_page_url);
            }
        } catch (error) {
            console.error('Failed to load more members', error);
        } finally {
            setLoadingMore(false);
        }
    }, [nextPageUrl, loadingMore]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Spaces', href: spaceRoute.index().url },
        { title: space.name, href: spaceRoute.show(space.slug).url },
        { title: 'Members', href: `/spaces/${space.slug}/members` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Members - ${space.name}`} />

            <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Space Members
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage access and roles for your collaborators.
                        </p>
                    </div>
                    {can.manageMembers && (
                        <InviteMemberDialog spaceSlug={space.slug} />
                    )}
                </div>

                <div className="space-y-6">
                    {/* Filters */}
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="bg-card pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Member List */}
                    {membersList.length > 0 ? (
                        <div className="grid gap-3">
                            <MemberCard
                                member={{
                                    ...(space.owner as any),
                                    pivot: {
                                        role: 'admin',
                                        joined_at: space.created_at,
                                    },
                                }}
                                spaceSlug={space.slug}
                                isOwner={true}
                                currentUserIsAdmin={false}
                            />
                            {membersList.map((member) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    spaceSlug={space.slug}
                                    isOwner={false}
                                    currentUserIsAdmin={can.manageMembers}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">
                                No members yet
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Add contributors to collaborate in this space.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {nextPageUrl && (
                        <div className="mt-8 flex items-center justify-center border-t border-dashed pt-8">
                            {loadingMore ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Loading more members...</span>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={loadMore}
                                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                                >
                                    Load more members
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
