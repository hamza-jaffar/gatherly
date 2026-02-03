import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Users, FileText, Copy, Check, Share2 } from 'lucide-react';
import spaceRoute from '@/routes/space';
import { Space } from '@/types/space';
import { UserInfo } from '@/components/user-info';
import { toast } from 'sonner';
import { useState } from 'react';
import SharedModal from '@/components/spaces/shared-modal';
import ItemList from '@/components/items/item-list';
import ItemCreateForm from '@/components/items/item-create-form';
import { router } from '@inertiajs/react';

interface Props {
    space: Space;
    items: any[];
    filters?: any;
}

export default function SpaceShow({ space, items, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [openSharedModal, setOpenSharedModal] = useState(false);
    const [shareUrl, setShareUrl] = useState<string>('');

    // ... handleShareClick, copyUrl, etc. stay same recursively
    const handleShareClick = () => {
        const baseUrl = `${window.location.origin}${spaceRoute.show(space.slug).url}`;
        const visitorId = crypto.randomUUID();
        setShareUrl(`${baseUrl}?vid=${visitorId}`);
        setOpenSharedModal(true);
    };
    const totalVisits =
        space.visits?.reduce((acc, visit) => acc + visit.visit_count, 0) || 0;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Spaces',
            href: spaceRoute.index().url,
        },
        {
            title: space.name,
            href: spaceRoute.show(space.slug).url,
        },
    ];

    const [isCopied, setIsCopied] = useState(false);

    const copyUrl = () => {
        const url = window.location.origin + spaceRoute.show(space.slug).url;
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={space.name} />

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header ... omitted for length, same as before ... */}
                <div className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
                                {space.name}{' '}
                                <div
                                    onClick={handleShareClick}
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-background hover:text-foreground hover:shadow-sm"
                                >
                                    <Share2 className="h-4 w-4" />
                                </div>
                            </h1>
                            <Badge
                                variant={
                                    space.is_private ? 'secondary' : 'outline'
                                }
                            >
                                {space.is_private ? 'Private' : 'Public'}
                            </Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Created on{' '}
                            {new Date(space.created_at).toLocaleDateString()}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Total Visit: {totalVisits}
                        </p>
                    </div>
                    {space.owner.id === auth.user?.id && (
                        <div className="flex gap-2">
                            <Link href={spaceRoute.edit(space.slug).url}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Space
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <h3 className="leading-none font-semibold tracking-tight">
                                    About this Space
                                </h3>
                            </div>
                            <div className="p-6 pt-0">
                                <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                    {space.description ||
                                        'No description provided.'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Recent Items
                                </h2>
                                <Link
                                    href={`/spaces/${space.slug}/items`}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    View all items →
                                </Link>
                            </div>
                            <ItemList
                                items={items}
                                spaceSlug={space.slug}
                                variant="summary"
                            />
                        </div>
                    </div>

                    {/* Sidebar / Meta Info */}
                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="leading-none font-semibold tracking-tight">
                                    Details
                                </h3>
                            </div>
                            <div className="p-6 pt-0 text-sm">
                                <div className="space-y-4">
                                    <div>
                                        <span className="mb-2 block font-medium text-foreground">
                                            Owner
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <UserInfo
                                                user={space.owner}
                                                showEmail
                                            />
                                        </div>
                                    </div>
                                    <div className="border-t pt-4">
                                        <span className="mb-1 block font-medium text-foreground">
                                            Public URL
                                        </span>
                                        <code className="relative flex items-center justify-between truncate rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground">
                                            <span>
                                                {
                                                    spaceRoute.show(space.slug)
                                                        .url
                                                }
                                            </span>
                                            {isCopied ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy
                                                    className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                                                    onClick={copyUrl}
                                                />
                                            )}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openSharedModal && (
                <SharedModal
                    open={openSharedModal}
                    setOpen={setOpenSharedModal}
                    url={shareUrl}
                    title={space.name}
                />
            )}
        </AppLayout>
    );
}
