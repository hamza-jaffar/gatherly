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
                    {/* 
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_private"
                            checked={data.is_private}
                            onCheckedChange={(checked) =>
                                setData('is_private', checked)
                            }
                        />
                        <Label htmlFor="is_private">Private Space</Label>
                    </div> */}
                    <p className="text-sm text-muted-foreground">
                        Private spaces are only visible to members you invite.
                    </p>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Space'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
