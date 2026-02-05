import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ItemList from '@/components/items/item-list';
import ItemCreateForm from '@/components/items/item-create-form';
import { Space } from '@/types/space';
import { BreadcrumbItem } from '@/types';
import spaceRoute from '@/routes/space';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import itemRoute from '@/routes/item';
import axios from 'axios';

interface Props {
    space: Space;
    items: {
        data: any[];
        next_cursor: string | null;
        prev_cursor: string | null;
    };
    filters?: any;
    can: {
        createItem: boolean;
    };
}

export default function ItemsIndex({
    space,
    items: initialItems,
    filters,
    can,
}: Props) {
    const [openCreateItemModal, setOpenCreateItemModal] = useState(false);

    const [itemsList, setItemsList] = useState(initialItems.data);
    const [nextCursor, setNextCursor] = useState(initialItems.next_cursor);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        setItemsList(initialItems.data);
        setNextCursor(initialItems.next_cursor);
    }, [initialItems]);

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
            href: itemRoute.index(space.slug).url,
        },
    ];

    const loadMore = useCallback(async () => {
        if (!nextCursor || loadingMore) return;

        setLoadingMore(true);
        try {
            const response = await axios.get(window.location.pathname, {
                params: { ...filters, cursor: nextCursor },
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const { items: newItemsData } = response.data;

            if (newItemsData && newItemsData.data) {
                setItemsList((prev) => [...prev, ...newItemsData.data]);
                setNextCursor(newItemsData.next_cursor);
            }
        } catch (error) {
            console.error('Failed to load more items', error);
        } finally {
            setLoadingMore(false);
        }
    }, [nextCursor, loadingMore, filters]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Items - ${space.name}`} />

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <ItemList
                        items={itemsList}
                        spaceSlug={space.slug}
                        filters={filters}
                        onAddItemClick={() => setOpenCreateItemModal(true)}
                        hasMore={!!nextCursor}
                        onLoadMore={loadMore}
                        isLoadingMore={loadingMore}
                        canCreate={can.createItem}
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
