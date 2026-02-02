import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import space from '@/routes/space';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Spaces',
        href: space.index().url,
    },
    {
        title: 'Create',
        href: space.create().url,
    },
];

export default function SpaceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        is_private: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(space.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Space" />

            <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Create New Space</h1>
                <p className="text-sm text-muted-foreground">
                    A space is a shared place where you and others can manage
                    tasks, notes, and conversations.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    {/* Space Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Space name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Product Planning, Family Tasks"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            Choose a clear name so people know what this space
                            is for.
                        </p>
                        <InputError message={errors.name} />
                    </div>

                    {/* Space Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description (optional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="What will you use this space for?"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <p className="text-sm text-muted-foreground">
                            A short description helps others understand the
                            purpose of this space.
                        </p>
                        <InputError message={errors.description} />
                    </div>

                    {/* Private Space Toggle (optional / future) */}
                    {/*
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="is_private">Private space</Label>
                            <p className="text-sm text-muted-foreground">
                                Only people you invite will be able to see and access this space.
                            </p>
                        </div>
                        <Switch
                            id="is_private"
                            checked={data.is_private}
                            onCheckedChange={(checked) =>
                                setData('is_private', checked)
                            }
                        />
                    </div>
                    */}

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full"
                    >
                        {processing ? 'Creating space…' : 'Create space'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
