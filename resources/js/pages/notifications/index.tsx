import AppLayout from '@/layouts/app-layout';
import { dashboard, getCurrentUserNotification } from '@/routes';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Notifications',
        href: getCurrentUserNotification().url,
    },
];

const Notifications = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>Notifications</div>
        </AppLayout>
    );
};

export default Notifications;
