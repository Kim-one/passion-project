'use client'
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/context/ContextAuth";
import BusinessSkeleton from "@/app/BusinessSkeleton";
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import Link from "next/link";
import {useState} from "react";

const NavBar = () => {
    const {user, logout, loading} = useAuth();
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);

    const handleRouting = (path: string) =>{
        router.push(`/${path}`)
    }

    if(loading){
        return (
            <BusinessSkeleton/>
        )
    }

    return (

        <div className={'flex items-center justify-between text-slate-100 h-20 px-6 z-50 bg-background-dark border-b border-white/5 top-0 sticky backdrop-blur-md'}>
            <Link className={'text-2xl font-black text-white tracking-tighter'} href={'/'}>876<span className={'font-bold text-secondary-dark uppercase'}>Explore</span></Link>
            <div className={'hidden md:flex items-center gap-10'}>
                <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/discovery'}>Discovery</Link>
                <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/'}>Events</Link>
                <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/'}>Hotspots</Link>
                {/*<Link href={}/>*/}
            </div>
            <div className={'flex items-center gap-4'}>
                <button suppressHydrationWarning onClick={() => handleRouting('AddBusiness')}
                        className={'cursor-pointer hidden bg-secondary-dark rounded-full h-11 px-6 hover:brightness-110 shadow-lg shadow-secondary/10 tracking-tight font-bold text-sm text-background-dark sm:flex items-center justify-center'}>
                    Add a Business</button>
                {user ? (
                    <div className={'flex items-center gap-4'}>
                        <span className={'text-sm text-white/70'}>Hi, <span className={'font-bold text-white'}>{user.name.split(' ')[0]}</span></span>
                        <button
                            onClick={logout}
                            className={'cursor-pointer hidden bg-background-surface rounded-full border border-white/10 hover:bg-white/5 h-11 px-6 tracking-tight font-bold text-sm text-white sm:flex items-center justify-center'}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button suppressHydrationWarning onClick={() => handleRouting('login')}
                            className={'cursor-pointer hidden bg-background-surface rounded-full border border-white/10 bg-background-surface hover:bg-white/5 h-11 px-6  tracking-tight font-bold text-sm text-white sm:flex items-center justify-center'}>
                        Login
                    </button>
                )}
                <button className={'md:hidden text-white'} onClick={() => setOpenMenu(!openMenu)}>
                    {openMenu ? <HiOutlineX size={30}/> : <HiOutlineMenu size={30}/>}
                </button>
            </div>
            {openMenu &&(
                <div className={'text-white flex md:hidden'}>
                    <div className={'flex flex-col'}>
                        <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/discovery'}>Discovery</Link>
                        <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/'}>Events</Link>
                        <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/'}>Hotspots</Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NavBar;