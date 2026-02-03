import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ItemList from '@/components/items/item-list';
import ItemCreateForm from '@/components/items/item-create-form';
import { Space } from '@/types/space';
import { BreadcrumbItem } from '@/types';
import spaceRoute from '@/routes/space';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface Props {
    space: Space;
    items: any[];
    filters?: any;
}

export default function ItemsIndex({ space, items, filters }: Props) {
    const [openCreateItemModal, setOpenCreateItemModal] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Spaces',
            href: spaceRoute.index().url,
        },
        {
            title: space.name,
            href: spaceRoute.show(space.slug).url,
        },
        {
            title: 'Items',
            href: `/spaces/${space.slug}/items`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Items - ${space.name}`} />

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between border-b pb-6">
                    <div>
                        <Link
                            href={spaceRoute.show(space.slug).url}
                            className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Space
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Items
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage all tasks and notes in this space.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <ItemList
                        items={items}
                        spaceSlug={space.slug}
                        filters={filters}
                        onAddItemClick={() => setOpenCreateItemModal(true)}
                    />
                </div>
            </div>

            <ItemCreateForm
                open={openCreateItemModal}
                onOpenChange={setOpenCreateItemModal}
                spaceSlug={space.slug}
            />
        </AppLayout>
    );
}
