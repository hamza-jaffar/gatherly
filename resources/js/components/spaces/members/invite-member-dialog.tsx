import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface InviteMemberDialogProps {
    spaceSlug: string;
}

export function InviteMemberDialog({ spaceSlug }: InviteMemberDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role: 'member',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/spaces/${spaceSlug}/members`, {
            onSuccess: () => {
                toast.success('Invitation sent');
                setOpen(false);
                reset();
            },
            onError: () => toast.error('Failed to invite member'),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Invite Member</DialogTitle>
                        <DialogDescription>
                            Add a new member to this space by their email
                            address.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="name@example.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={(v) => setData('role', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="editor">
                                        Editor
                                    </SelectItem>
                                    <SelectItem value="member">
                                        Member
                                    </SelectItem>
                                    <SelectItem value="viewer">
                                        Viewer
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Sending...' : 'Send Invite'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
