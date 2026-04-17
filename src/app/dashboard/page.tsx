import Navbar from "@/components/Navbar";

const stats = [
    { title: "Tests Taken", value: "12" },
    { title: "Average Score", value: "78%" },
    { title: "Current Streak", value: "5 Days" },
    { title: "Rank Progress", value: "+14" },
];

const recentTests = [
    { name: "UPSC Polity Mock 1", score: "82%", date: "Today" },
    { name: "APSC Geography Practice", score: "74%", date: "Yesterday" },
    { name: "Current Affairs Quiz", score: "88%", date: "2 days ago" },
];

const weakAreas = [
    "Modern History",
    "Environment",
    "Assam Geography",
];

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <section className="px-6 pb-20 pt-32 md:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
                            Student Dashboard
                        </p>
                        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                            Track your preparation in one place
                        </h1>
                        <p className="mt-5 text-white/75 md:text-lg">
                            Monitor tests, scores, weak areas, and daily progress with a cleaner premium dashboard.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(255,255,255,0.04)] backdrop-blur-xl"
                            >
                                <p className="text-sm text-white/60">{item.title}</p>
                                <h2 className="mt-3 text-3xl font-bold">{item.value}</h2>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-semibold">Recent Test Activity</h3>
                                <a
                                    href="/test-series"
                                    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
                                >
                                    New Test
                                </a>
                            </div>

                            <div className="mt-6 space-y-4">
                                {recentTests.map((test) => (
                                    <div
                                        key={test.name}
                                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div>
                                            <h4 className="text-lg font-semibold">{test.name}</h4>
                                            <p className="mt-1 text-sm text-white/60">{test.date}</p>
                                        </div>

                                        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                                            Score: {test.score}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                                <h3 className="text-2xl font-semibold">Weak Areas</h3>
                                <div className="mt-5 space-y-3">
                                    {weakAreas.map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/85"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                                <h3 className="text-2xl font-semibold">Quick Actions</h3>
                                <div className="mt-5 flex flex-col gap-3">
                                    <a
                                        href="/test-series"
                                        className="rounded-full bg-white px-5 py-3 text-center font-semibold text-black"
                                    >
                                        Start Mock Test
                                    </a>
                                    <a
                                        href="/pricing"
                                        className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center font-semibold text-white"
                                    >
                                        Upgrade Premium
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}