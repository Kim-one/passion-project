'use client'
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/context/ContextAuth";
import BusinessSkeleton from "@/app/BusinessSkeleton";
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import Link from "next/link";
import {useState, useEffect, useRef} from "react";

const NavBar = () => {
    const {user, logout, loading} = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);
    const profileButtonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();
    const [openMobileNavMenu, setOpenMobileNavMenu] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const handleRouting = (path: string) =>{
        router.push(`/${path}`)
    }

    if(loading){
        return (
            <BusinessSkeleton/>
        )
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                profileButtonRef.current &&
                !profileButtonRef.current.contains(target)
            ) {
                setOpenMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className={'flex items-center justify-between text-slate-100 h-20 px-6 z-50 bg-background-dark border-b border-white/5 top-0 sticky backdrop-blur-md'}>
                <Link className={'text-2xl font-black text-white tracking-tighter'} href={'/'}>876<span className={'font-bold text-secondary-dark uppercase'}>Explore</span></Link>
                <div className={'hidden md:flex items-center gap-10'}>
                    <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/discovery'}>Discovery</Link>
                    <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/events'}>Events</Link>
                    <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/hotspots'}>Hotspots</Link>
                    {/*<Link href={}/>*/}
                </div>
                <div className={'flex items-center gap-4'}>
                    <button suppressHydrationWarning onClick={() => handleRouting('AddBusiness')}
                            className={'cursor-pointer hidden bg-secondary-dark rounded-full h-11 px-6 hover:brightness-110 shadow-lg shadow-secondary/10 tracking-tight font-bold text-sm text-background-dark sm:flex items-center justify-center'}>
                        Add a Business</button>
                    {user ? (
                        <button
                            ref={profileButtonRef}
                            onClick={() => setOpenMenu(prev => !prev)}
                            className="h-10 w-10 rounded-full border-2 border-secondary-dark overflow-hidden"
                        >
                            <img
                                src="/images/ProfilePic.png"
                                className="w-full h-full object-cover"
                                alt="Profile"
                            />
                        </button>
                    ) : (
                        <button suppressHydrationWarning onClick={() => handleRouting('login')}
                                className={'cursor-pointer hidden bg-background-surface rounded-full border border-white/10 bg-background-surface hover:bg-white/5 h-11 px-6  tracking-tight font-bold text-sm text-white sm:flex items-center justify-center'}>
                            Login
                        </button>
                    )}
                    <button className={'md:hidden text-white'} onClick={() => setOpenMobileNavMenu(!openMobileNavMenu)}>
                        {openMobileNavMenu ? <HiOutlineX size={30}/> : <HiOutlineMenu size={30}/>}
                    </button>
                </div>
                {openMobileNavMenu &&(
                    <div className={'text-white flex md:hidden'}>
                        <div className={'flex flex-col'}>
                            <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/discovery'}>Discovery</Link>
                            <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/events'}>Events</Link>
                            <Link className={'text-sm font-semibold hover:text-secondary-dark transition-colors'} href={'/hotspots'}>Hotspots</Link>
                        </div>
                    </div>
                )}
            </div>
            {openMenu &&(
                <div ref={menuRef} className={'flex flex-col border border-secondary-dark bg-background-dark text-white rounded-lg right-0 w-72 absolute z-50 px-6 py-2'}>
                    <Link href={'/userProfile'} onClick={() => setOpenMenu(false)} className={'border-b border-gray-300 p-3'}>Profile</Link>
                    {user?.is_admin && (
                        <Link href={'/admin'} onClick={() => setOpenMenu(false)} className={'border-b border-gray-300 p-3 flex items-center gap-2 text-secondary-dark font-semibold'}>
                            <span className="material-symbols-outlined text-lg">shield_person</span>
                            Admin Dashboard
                        </Link>
                    )}
                    <Link href={'/settings'} onClick={() => setOpenMenu(false)} className={'border-b border-gray-300 p-3'}>Account Settings</Link>
                    <p onClick={() => {
                        logout();
                        setOpenMenu(false);
                    }} className={'border-b border-gray-300 p-3 text-red-500'}>Sign Out</p>
                </div>
            )}
        </div>
    )
}

export default NavBar;