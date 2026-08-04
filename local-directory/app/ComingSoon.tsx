'use client'
import Link from "next/link";

interface ComingSoonProps {
    eyebrow?: string;
    title: string;
    description: string;
    icon?: string;              // Material Symbols icon name
    features?: string[];        // optional "what to expect" bullets
}

const ComingSoon = ({eyebrow = 'Coming Soon', title, description, icon = 'rocket_launch', features}: ComingSoonProps) => {
    return (
        <div className={'bg-charcoal text-white min-h-[70vh] flex items-center justify-center px-6 py-20'}>
            <div className={'max-w-2xl w-full flex flex-col items-center text-center'}>
                {/* Icon */}
                <div className={'relative mb-8'}>
                    <div className={'absolute inset-0 bg-secondary-dark/20 blur-2xl rounded-full'}/>
                    <div className={'relative flex items-center justify-center size-24 rounded-3xl bg-surface-darker border border-secondary-dark/30'}>
                        <span className="material-symbols-outlined text-secondary-dark" style={{fontSize: 48}}>{icon}</span>
                    </div>
                </div>

                <p className={'text-xs font-black uppercase tracking-[0.3em] text-secondary-dark mb-4'}>{eyebrow}</p>
                <h1 className={'text-4xl md:text-6xl font-black tracking-tight mb-5'}>{title}</h1>
                <p className={'text-slate-400 text-lg max-w-xl mb-10'}>{description}</p>

                {features && features.length > 0 && (
                    <div className={'grid sm:grid-cols-2 gap-3 w-full mb-12 text-left'}>
                        {features.map((f) => (
                            <div key={f} className={'flex items-center gap-3 bg-surface-darker border border-white/5 rounded-2xl px-4 py-3'}>
                                <span className="material-symbols-outlined text-secondary-dark text-lg">check_circle</span>
                                <span className={'text-sm text-slate-300'}>{f}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={'flex flex-wrap items-center justify-center gap-3'}>
                    <Link href={'/discovery'}
                          className={'bg-secondary-dark text-background-darker font-black uppercase tracking-widest text-sm px-6 py-3.5 rounded-full hover:brightness-110 transition-all'}>
                        Explore Businesses
                    </Link>
                    <Link href={'/'}
                          className={'border border-white/15 text-white font-bold px-6 py-3.5 rounded-full hover:bg-white/5 transition-colors'}>
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
