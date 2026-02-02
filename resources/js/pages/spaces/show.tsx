import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import spaceRoute from '@/routes/space';
import { Space } from '@/types/space';
import { UserInfo } from '@/components/user-info';

interface Props {
    space: Space;
}

export default function SpaceShow({ space }: Props) {
    const { auth } = usePage<SharedData>().props;
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={space.name} />

            <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-6 p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{space.name}</h1>
                            <Badge
                                variant={
                                    space.is_private ? 'secondary' : 'outline'
                                }
                            >
                                {space.is_private ? 'Private' : 'Public'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            URL: {spaceRoute.show(space.slug).url}
                        </p>
                    </div>
                    {space.owner.id === auth.user?.id && (
                        <Link href={spaceRoute.edit(space.slug).url}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Space
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">Description</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                            {space.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-foreground">
                                Owner:
                            </span>
                            <div className="mt-2 flex items-center gap-2">
                                <UserInfo user={space.owner} showEmail />
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold text-foreground">
                                Created At:
                            </span>
                            <span className="text-muted-foreground">
                                {new Date(
                                    space.created_at,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
