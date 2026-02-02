import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, Facebook, Linkedin, Mail, Twitter } from 'lucide-react';
import { useState } from 'react';

interface SharedModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    url: string;
    title: string;
}

export default function SharedModal({
    open,
    setOpen,
    url,
    title,
}: SharedModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code: ', err);
        }
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-message-circle h-5 w-5"
                >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
            ), // Let's use a clear SVG or a generic Share icon if needed, but here I'll try to provide a good "WhatsApp" style button or just generic structure.
            href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            color: 'bg-[#25D366] hover:bg-[#25D366]/90',
        },
        {
            name: 'Twitter',
            icon: <Twitter className="h-5 w-5" />,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90',
        },
        {
            name: 'Facebook',
            icon: <Facebook className="h-5 w-5" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'bg-[#1877F2] hover:bg-[#1877F2]/90',
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin className="h-5 w-5" />,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            color: 'bg-[#0A66C2] hover:bg-[#0A66C2]/90',
        },
        {
            name: 'Email',
            icon: <Mail className="h-5 w-5" />,
            href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
            color: 'bg-gray-600 hover:bg-gray-600/90',
        },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Space</DialogTitle>
                    <DialogDescription>
                        Share "{title}" with your team or friends.
                    </DialogDescription>
                </DialogHeader>

                {/* Social Grid */}
                <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3">
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-3 text-white transition-all ${link.color}`}
                        >
                            {link.icon}
                            <span className="text-xs font-medium">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={url}
                            readOnly
                            className="h-9"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="px-3"
                        onClick={handleCopy}
                    >
                        <span className="sr-only">Copy</span>
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
