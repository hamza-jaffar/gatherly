import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Layout,
    CheckCircle2,
    StickyNote,
    Users2,
    ArrowRight,
    Zap,
    Github,
    Twitter,
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
            <Head title="Gatherly - Your Collaborative Workspace" />

            {/* Navigation */}
            <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            Gatherly
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={dashboard()}>
                                <Button
                                    variant="default"
                                    className="cursor-pointer font-medium"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}>
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer font-medium"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                {canRegister && (
                                    <Link href={register()}>
                                        <Button
                                            variant="default"
                                            className="cursor-pointer font-medium shadow-lg shadow-primary/20"
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div className="relative z-10 flex flex-col items-start gap-6 lg:max-w-xl">
                                <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground ring-1 ring-muted-foreground/10 ring-inset">
                                    <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                        New
                                    </span>
                                    Introducing Spaces & Notes
                                </div>
                                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                                    Gather Your Team,{' '}
                                    <span className="text-primary">Ideas</span>,
                                    and Tasks.
                                </h1>
                                <p className="text-xl leading-relaxed text-muted-foreground">
                                    One unified workspace to manage projects,
                                    share thoughts with sticky notes, and keep
                                    everyone in sync. Effortless collaboration
                                    starts here.
                                </p>
                                <div className="flex w-full flex-col gap-4 sm:flex-row">
                                    <Link
                                        href={register()}
                                        className="w-full sm:w-auto"
                                    >
                                        <Button
                                            size="lg"
                                            className="h-12 w-full cursor-pointer px-8 text-lg font-semibold shadow-xl shadow-primary/30 sm:w-auto"
                                        >
                                            Start for Free
                                        </Button>
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="w-full sm:w-auto"
                                    >
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="h-12 w-full cursor-pointer px-8 text-lg font-medium sm:w-auto"
                                        >
                                            Watch Demo
                                        </Button>
                                    </Link>
                                </div>
                                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="h-8 w-8 rounded-full border-2 border-background bg-muted shadow-sm"
                                            />
                                        ))}
                                    </div>
                                    <p>Join 2,000+ teams already gathering.</p>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

                                <div className="relative overflow-hidden rounded-2xl border bg-muted/30 p-2 shadow-2xl backdrop-blur-sm transition-all duration-700 hover:scale-[1.02]">
                                    <img
                                        src="/images/hero.png"
                                        alt="Gatherly Workspace Visual"
                                        className="h-auto w-full rounded-xl shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Icons Section */}
                <section className="border-y bg-muted/30 py-12">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-around gap-8 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                            <div className="flex items-center gap-2 text-2xl font-bold tracking-widest text-muted-foreground uppercase">
                                Logitech
                            </div>
                            <div className="flex items-center gap-2 text-2xl font-bold tracking-widest text-muted-foreground uppercase">
                                Microsoft
                            </div>
                            <div className="flex items-center gap-2 text-2xl font-bold tracking-widest text-muted-foreground uppercase">
                                Slack
                            </div>
                            <div className="flex items-center gap-2 text-2xl font-bold tracking-widest text-muted-foreground uppercase">
                                Linear
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features */}
                <section className="py-24 lg:py-32">
                    <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 sm:text-left lg:px-8">
                        <div className="mb-16 flex flex-col items-center gap-4 text-center">
                            <h2 className="text-base font-bold tracking-widest text-primary uppercase">
                                Powerful Tools
                            </h2>
                            <h3 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                Everything you need to ship faster.
                            </h3>
                            <p className="max-w-2xl text-lg text-muted-foreground">
                                We've combined the best of task management and
                                note-taking into a single, cohesive experience.
                                No more context switching.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group relative flex flex-col gap-6 rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Layout className="h-6 w-6" />
                                </div>
                                <h4 className="text-2xl font-bold">
                                    Dynamic Spaces
                                </h4>
                                <p className="text-muted-foreground">
                                    Organize your work into dedicated spaces.
                                    Each room has its own set of members,
                                    privacy settings, and visual identity.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group relative flex flex-col gap-6 rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                                    <StickyNote className="h-6 w-6" />
                                </div>
                                <h4 className="text-2xl font-bold">
                                    Collaborative Notes
                                </h4>
                                <p className="text-muted-foreground">
                                    Capture ideas as they happen with our unique
                                    sticky-note engine. Fast, fluid, and fun to
                                    use for brainstorming.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group relative flex flex-col gap-6 rounded-3xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h4 className="text-2xl font-bold">
                                    Task Management
                                </h4>
                                <p className="text-muted-foreground">
                                    Never miss a deadline. Track progress with
                                    task statuses, due dates, and real-time
                                    updates across your team.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="pb-24 lg:pb-32">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-20 text-center text-primary-foreground shadow-2xl sm:px-16 sm:py-32">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2)_0%,transparent_50%)] opacity-10" />

                            <div className="relative z-10 mx-auto max-w-2xl">
                                <h2 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
                                    Ready to gather your team?
                                </h2>
                                <p className="mb-10 text-xl text-primary-foreground/80">
                                    Stop wasting time across multiple tools.
                                    Join Gatherly today and experience the
                                    future of collaboration.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link href={register()}>
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            className="h-14 cursor-pointer px-10 text-lg font-bold"
                                        >
                                            Get Started Now
                                        </Button>
                                    </Link>
                                    <p className="text-sm font-medium opacity-70">
                                        No credit card required.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-12">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                                <Zap className="h-4 w-4 fill-current" />
                            </div>
                            <span className="font-bold tracking-tight">
                                Gatherly
                            </span>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Gatherly Inc. Designed
                            for teams everywhere.
                        </p>

                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
