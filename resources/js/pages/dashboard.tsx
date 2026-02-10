import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Activity,
    Zap,
    CheckCircle2,
    Clock,
    TrendingUp,
    FolderOpen,
    FileText,
    AlertCircle,
    Bell,
    Eye,
    ArrowRight,
} from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Stats {
    total_spaces: number;
    total_items: number;
    total_tasks: number;
    completed_tasks: number;
}

interface ActivityLogItem {
    id: number;
    action: string;
    resource_type: string;
    resource_id: number;
    created_at: string;
}

interface MostVisitedSpace {
    space_id: number;
    total_visits: number;
    space: {
        id: number;
        name: string;
        slug: string;
    };
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    created_at: string;
}

interface Space {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    items_count: number;
}

interface ItemStat {
    status: string;
    count: number;
}

interface DashboardProps {
    stats: Stats;
    recentActivities: ActivityLogItem[];
    mostVisitedSpaces: MostVisitedSpace[];
    recentNotifications: Notification[];
    taskStats: {
        pending: number;
        in_progress: number;
        completed: number;
    };
    userSpaces: Space[];
    itemStats: ItemStat[];
}

export default function Dashboard({
    stats,
    recentActivities,
    mostVisitedSpaces,
    recentNotifications,
    taskStats,
    userSpaces,
    itemStats,
}: DashboardProps) {
    const getActionColor = (action: string) => {
        const lower = action.toLowerCase();
        if (lower.includes('create')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        if (lower.includes('update')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        if (lower.includes('delete')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    const getNotificationIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'success':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Bell className="h-5 w-5 text-blue-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const completionRate = stats.total_tasks > 0
        ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Section */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your spaces, tasks, and recent activities
                    </p>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Spaces */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_spaces}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Workspaces you own
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Items */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_items}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all spaces
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Tasks */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasks Assigned</CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tasks}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {completionRate}% completed
                            </p>
                        </CardContent>
                    </Card>

                    {/* Completion Rate */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completionRate}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.completed_tasks} of {stats.total_tasks} tasks
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Main Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Task Status Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Status Overview</CardTitle>
                                <CardDescription>Distribution of your assigned tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-yellow-500" />
                                                <span className="text-sm font-medium">Pending</span>
                                            </div>
                                            <span className="text-2xl font-bold">{taskStats.pending}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${stats.total_tasks > 0 ? (taskStats.pending / stats.total_tasks) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm font-medium">In Progress</span>
                                            </div>
                                            <span className="text-2xl font-bold">{taskStats.in_progress}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${stats.total_tasks > 0 ? (taskStats.in_progress / stats.total_tasks) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span className="text-sm font-medium">Completed</span>
                                            </div>
                                            <span className="text-2xl font-bold">{taskStats.completed}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${stats.total_tasks > 0 ? (taskStats.completed / stats.total_tasks) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activities */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Activities</CardTitle>
                                    <CardDescription>Your latest account activities</CardDescription>
                                </div>
                                <Link href="/settings/activities" className="text-sm text-primary hover:underline">
                                    View All
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {recentActivities.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentActivities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-start justify-between gap-4 pb-4 border-b last:pb-0 last:border-0"
                                            >
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <Badge className={`${getActionColor(activity.action)} shrink-0 mt-1`}>
                                                        {activity.action}
                                                    </Badge>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {activity.resource_type}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            ID: {activity.resource_id}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {formatDate(activity.created_at)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {formatTime(activity.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No recent activities</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Side Cards */}
                    <div className="space-y-6">
                        {/* Most Visited Spaces */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Most Visited</CardTitle>
                                <CardDescription>Last 30 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {mostVisitedSpaces.length > 0 ? (
                                    <div className="space-y-3">
                                        {mostVisitedSpaces.map((item) => (
                                            <Link
                                                key={item.space_id}
                                                href={`/spaces/${item.space.slug}`}
                                                className="block group"
                                            >
                                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                                                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                            {item.space.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap shrink-0 ml-2">
                                                        {item.total_visits} visits
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-muted-foreground">
                                        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">No visited spaces yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Notifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Notifications</CardTitle>
                                <CardDescription>Unread items</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentNotifications.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                                            >
                                                <div className="shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-1">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatDate(notification.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-muted-foreground">
                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">All caught up!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Your Spaces Section */}
                {userSpaces.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight">Your Spaces</h2>
                            <Link
                                href="/spaces"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                View All
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {userSpaces.map((space) => (
                                <Link
                                    key={space.id}
                                    href={`/spaces/${space.slug}`}
                                    className="block group"
                                >
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base group-hover:text-primary transition-colors truncate">
                                                        {space.name}
                                                    </CardTitle>
                                                    <CardDescription className="line-clamp-2 mt-1">
                                                        {space.description || 'No description'}
                                                    </CardDescription>
                                                </div>
                                                <FolderOpen className="h-5 w-5 text-muted-foreground shrink-0" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-2xl font-bold">{space.items_count}</p>
                                                    <p className="text-xs text-muted-foreground">Items</p>
                                                </div>
                                                <Badge variant="secondary">
                                                    {formatDate(space.created_at)}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
