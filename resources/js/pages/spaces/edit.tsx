import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import spaceRoute from '@/routes/space';

interface Space {
    id: number;
    name: string;
    description: string;
    slug: string;
    is_private: boolean;
}

interface Props {
    space: Space;
}

export default function SpaceEdit({ space }: Props) {
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
            title: 'Edit',
            href: spaceRoute.edit(space.slug).url,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: space.name,
        slug: space.slug,
        description: space.description || '',
        is_private: space.is_private,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(spaceRoute.update(space.slug).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${space.name}`} />

            <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Edit Space</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Changing the slug will change the URL of the space.
                        </p>
                        <InputError message={errors.slug} />
                    </div> */}

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* <div className="flex items-center space-x-2">
                        <Switch
                            id="is_private"
                            checked={data.is_private}
                            onCheckedChange={(checked) =>
                                setData('is_private', checked)
                            }
                        />
                        <Label htmlFor="is_private">Private Space</Label>
                    </div> */}

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
