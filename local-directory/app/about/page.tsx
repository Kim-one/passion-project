import Link from "next/link";

const VALUES = [
    {
        icon: 'storefront',
        title: 'Champion Local',
        body: 'Every roadside jerk stand, family-run guesthouse and hidden cafe deserves to be found. We put local businesses front and centre.',
    },
    {
        icon: 'diversity_3',
        title: 'Built by the Community',
        body: 'Listings, reviews and ratings come from real people exploring the island — not faceless algorithms.',
    },
    {
        icon: 'verified',
        title: 'Quality You Can Trust',
        body: 'Every business is reviewed and approved before it goes live, so what you discover is genuine and worth your time.',
    },
];

const STATS = [
    {value: '14', label: 'Parishes'},
    {value: '100%', label: 'Locally Focused'},
    {value: '876', label: 'Island Pride'},
];

export default function AboutPage() {
    return (
        <div className={'bg-charcoal text-white'}>
            {/* Hero */}
            <section className={'max-w-4xl mx-auto px-6 pt-24 pb-16 text-center'}>
                <p className={'text-xs font-black uppercase tracking-[0.3em] text-secondary-dark mb-4'}>About Us</p>
                <h1 className={'text-4xl md:text-6xl font-black tracking-tight mb-6'}>
                    The heart of Jamaica, <span className={'italic text-secondary-dark'}>in one place.</span>
                </h1>
                <p className={'text-slate-400 text-lg max-w-2xl mx-auto'}>
                    876 Explore is a local directory built to connect residents and visitors with the best
                    businesses, experiences and hidden gems across all fourteen parishes of Jamaica.
                </p>
            </section>

            {/* Stats */}
            <section className={'max-w-4xl mx-auto px-6 pb-20'}>
                <div className={'grid grid-cols-3 gap-4'}>
                    {STATS.map((s) => (
                        <div key={s.label} className={'bg-surface-darker border border-white/5 rounded-2xl p-6 text-center'}>
                            <p className={'text-3xl md:text-4xl font-black text-secondary-dark'}>{s.value}</p>
                            <p className={'text-xs uppercase tracking-widest text-slate-500 mt-1'}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className={'max-w-4xl mx-auto px-6 pb-20'}>
                <div className={'flex items-center gap-4 mb-6'}>
                    <span className={'h-px w-12 bg-secondary-dark'}/>
                    <h2 className={'text-secondary-dark text-xs font-black uppercase tracking-[0.3em]'}>Our Mission</h2>
                </div>
                <p className={'text-white/80 text-xl md:text-2xl leading-relaxed font-light'}>
                    We believe the best of Jamaica isn&apos;t found in a guidebook — it&apos;s the cafe your
                    cousin swears by, the beach bar down a dirt road, the artisan who&apos;s been perfecting
                    their craft for decades. Our mission is to make those places easy to find, and to give
                    every local business a stage to be discovered.
                </p>
            </section>

            {/* Values */}
            <section className={'max-w-5xl mx-auto px-6 pb-20'}>
                <div className={'grid md:grid-cols-3 gap-6'}>
                    {VALUES.map((v) => (
                        <div key={v.title} className={'bg-surface-darker border border-white/5 rounded-3xl p-8 flex flex-col gap-4'}>
                            <div className={'flex items-center justify-center size-14 rounded-2xl bg-secondary-dark/15 border border-secondary-dark/30'}>
                                <span className="material-symbols-outlined text-secondary-dark">{v.icon}</span>
                            </div>
                            <h3 className={'text-xl font-bold'}>{v.title}</h3>
                            <p className={'text-slate-400 text-sm leading-relaxed'}>{v.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={'max-w-4xl mx-auto px-6 pb-28'}>
                <div className={'bg-gradient-to-br from-surface-darker to-background-dark border border-secondary-dark/20 rounded-3xl p-10 md:p-14 text-center'}>
                    <h2 className={'text-3xl md:text-4xl font-black tracking-tight mb-4'}>Own a business?</h2>
                    <p className={'text-slate-400 max-w-lg mx-auto mb-8'}>
                        List it for free and reach thousands of residents and visitors exploring the island every day.
                    </p>
                    <div className={'flex flex-wrap items-center justify-center gap-3'}>
                        <Link href={'/AddBusiness'}
                              className={'bg-secondary-dark text-background-darker font-black uppercase tracking-widest text-sm px-6 py-3.5 rounded-full hover:brightness-110 transition-all'}>
                            List Your Business
                        </Link>
                        <Link href={'/discovery'}
                              className={'border border-white/15 text-white font-bold px-6 py-3.5 rounded-full hover:bg-white/5 transition-colors'}>
                            Start Exploring
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
