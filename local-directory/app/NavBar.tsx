'use client'
import {useRouter} from "next/navigation";

const NavBar = () => {
    const router = useRouter();

    const handleRouting = (path: string) =>{
        router.push(`/${path}`)
    }

    return (
        <div className={'flex items-center justify-between text-slate-100 h-20 px-6 z-50 bg-background-dark border-b border-white/5 top-0 sticky backdrop-blur-md'}>
            <a className={'text-2xl font-black text-white tracking-tighter'} href={'/'}>876<span className={'font-bold text-secondary-dark uppercase'}>Explore</span></a>
            <div className={'hidden md:flex items-center gap-10'}>
                <a className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/discovery'}>Discovery</a>
                <a className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/'}>Events</a>
                <a className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/'}>Hotspots</a>
            </div>
            <div className={'flex items-center gap-4'}>
                <button suppressHydrationWarning onClick={() => handleRouting('AddBusiness')}
                        className={'cursor-pointer hidden bg-secondary-dark rounded-full h-11 px-6 hover:brightness-110 shadow-lg shadow-secondary/10 tracking-tight font-bold text-sm text-background-dark sm:flex items-center justify-center'}>
                    Add a Business</button>
                <button suppressHydrationWarning onClick={() => handleRouting('login')}
                        className={'cursor-pointer hidden bg-background-surface rounded-full border border-white/10 bg-background-surface hover:bg-white/5 h-11 px-6  tracking-tight font-bold text-sm text-white sm:flex items-center justify-center'}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default NavBar;