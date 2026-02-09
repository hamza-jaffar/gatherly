import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { activityLog, dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Activiy Log',
        href: activityLog().url,
    },
];

const ActivityLog = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />

            <h1 className="sr-only">Two-Factor Authentication Settings</h1>

            <SettingsLayout>
                <p>Table Here</p>
            </SettingsLayout>
        </AppLayout>
    );
};

export default ActivityLog;
