import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType, SharedData } from '@/types';
import { LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { login } from '@/routes';
import { Link, usePage } from '@inertiajs/react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = auth.user ? true : false;
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
                    <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </Link>
            )}
        </header>
    );
}
