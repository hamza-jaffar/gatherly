import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type {
    BreadcrumbItem as BreadcrumbItemType,
    Notification,
    SharedData,
} from '@/types';
import {
    BellRingIcon,
    LogIn,
    MailOpen,
    OctagonX,
    RotateCw,
} from 'lucide-react';
import { Button } from './ui/button';
import {
    getCurrentUserNotification,
    login,
    markNotificationAsRead,
} from '@/routes';
import { Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Spinner } from './ui/spinner';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;

    const [openNotificationBox, setOpenNotificationBox] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setOpenNotificationBox(false);
            }
        }

        if (openNotificationBox) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openNotificationBox]);

    // Fetch notifications (reusable)
    const loadNotifications = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetch(getCurrentUserNotification().url, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data: Notification[] = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Fail to load notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadNotifications();
        }
    }, [isAuthenticated, loadNotifications]);

    const MarkNotificationAsRead = (notificationId: number) => {
        router.post(markNotificationAsRead(notificationId));
        loadNotifications();
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                {isAuthenticated && (
                    <SidebarTrigger className="-ml-1 cursor-pointer" />
                )}
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {!isAuthenticated && (
                <Link href={login().url}>
                    <Button variant="ghost" size="sm">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </Link>
            )}

            {isAuthenticated && (
                <div className="relative" ref={notificationRef}>
                    <Button
                        variant="ghost"
                        onClick={() => setOpenNotificationBox((prev) => !prev)}
                    >
                        <BellRingIcon className="h-10 w-10" />
                    </Button>

                    {openNotificationBox && (
                        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border bg-background shadow-lg">
                            <div className="flex items-center justify-between border-b px-4 py-2 font-medium">
                                <span>Notifications</span>

                                <button
                                    onClick={loadNotifications}
                                    disabled={loading}
                                    className="opacity-60 hover:opacity-100 disabled:cursor-not-allowed"
                                >
                                    <RotateCw
                                        className={`h-5 w-5 ${
                                            loading ? 'animate-spin' : ''
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {loading ? (
                                    <div className="flex h-40 items-center justify-center">
                                        <Spinner />
                                    </div>
                                ) : notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <MailOpen
                                                onClick={() =>
                                                    MarkNotificationAsRead(
                                                        notification.id,
                                                    )
                                                }
                                                className="h-4 w-4 cursor-pointer text-muted-foreground"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex h-40 flex-col items-center justify-center gap-2 px-4 py-3 text-center text-sm text-muted-foreground">
                                        <OctagonX
                                            className="h-8 w-8 opacity-70"
                                            aria-hidden
                                        />
                                        No notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
