import Link from "next/link";

const  Footer = () => {
    return (
        <div className={'flex flex-row justify-between items-center bg-background-dark border-t border-t-white/2 py-10 px-5'}>
            <div className={'flex flex-col gap-2 items-center md:items-start'}>
                <h1 className={'text-white text-xl font-bold tracking-tighter'}>876<span className={'text-secondary-dark uppercase'}>Explore</span></h1>
                <p className={'text-slate-500 text-sm'}>© 2026 876Explore. ALL rights reserved.</p>
            </div>
            <div className={'flex gap-8 text-sm font bold'}>
                <Link className={'text-slate-400 '} href={'/about'}>About Us</Link>
                <Link className={'text-slate-400 '} href={'/privacy-policy'}>Privacy Policy</Link>
                <Link className={'text-slate-400 '} href={'/terms-of-service'}>Terms of Service</Link>
                <Link className={'text-slate-400 '} href={'/contact'}>Contact</Link>
            </div>
        </div>
    )
}

export default Footer;