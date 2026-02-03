import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface ItemCreateFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    spaceSlug: string;
}

export default function ItemCreateForm({
    open,
    onOpenChange,
    spaceSlug,
}: ItemCreateFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'TASK',
        title: '',
        description: '',
        status: 'TODO',
        due_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/spaces/${spaceSlug}/items`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            onError: () => {},
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Item</DialogTitle>
                        <DialogDescription>
                            Add a new task or note to your space.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(v) => setData('type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TASK">Task</SelectItem>
                                    <SelectItem value="NOTE">Note</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-xs text-destructive">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Enter title..."
                                required
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Add some details..."
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {data.type === 'TASK' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">
                                        Initial Status
                                    </Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) =>
                                            setData('status', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">
                                                Todo
                                            </SelectItem>
                                            <SelectItem value="IN_PROGRESS">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="REVIEW">
                                                Review
                                            </SelectItem>
                                            <SelectItem value="DONE">
                                                Done
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-xs text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData('due_date', e.target.value)
                                        }
                                    />
                                    {errors.due_date && (
                                        <p className="text-xs text-destructive">
                                            {errors.due_date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
