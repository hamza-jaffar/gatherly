import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    BreadcrumbItem,
    Pagination as PaginationType,
    SharedData,
} from '@/types';
import { Edit, Eye, Plus, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import spaceRoute from '@/routes/space';

interface Space {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_private: boolean;
    created_at: string;
    owner: {
        id: number;
        first_name: string;
        last_name: string;
    };
}

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

export default function SpaceIndex({ spaces, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    spaceRoute.index().url,
                    { search: search },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const confirmDelete = () => {
        if (deleteSlug) {
            router.delete(spaceRoute.destroy(deleteSlug).url, {
                onFinish: () => setDeleteSlug(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Spaces" />

            <div className="flex h-full flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Spaces</h1>
                    <Link href={spaceRoute.create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Space
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search spaces..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {spaces.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                spaces.data.map((space) => (
                                    <TableRow key={space.id}>
                                        <TableCell className="font-medium">
                                            {space.name}
                                            {space.description && (
                                                <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                                                    {space.description}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    space.is_private
                                                        ? 'secondary'
                                                        : 'default'
                                                }
                                            >
                                                {space.is_private
                                                    ? 'Private'
                                                    : 'Public'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {space.owner?.first_name}{' '}
                                            {space.owner?.last_name}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                space.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={
                                                        spaceRoute.show(
                                                            space.slug,
                                                        ).url
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={
                                                        spaceRoute.edit(
                                                            space.slug,
                                                        ).url
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        setDeleteSlug(
                                                            space.slug,
                                                        )
                                                    }
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Simple Pagination */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    {spaces.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`rounded border px-3 py-1 ${link.active ? 'bg-primary text-primary-foreground' : ''} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
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
