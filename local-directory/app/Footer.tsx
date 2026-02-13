const  Footer = () => {
    return (
        <div className={'flex flex-row justify-between items-center bg-background-dark border-t border-t-white/2 py-10 px-5'}>
            <div className={'flex flex-col gap-2 items-center md:items-start'}>
                <h1 className={'text-white text-xl font-bold tracking-tighter'}>876<span className={'text-secondary-dark uppercase'}>Explore</span></h1>
                <p className={'text-slate-500 text-sm'}>© 2026 876Explore. ALL rights reserved.</p>
            </div>
            <div className={'flex gap-8 text-sm font bold'}>
                <a className={'text-slate-400 '} href={'/about'}>About Us</a>
                <a className={'text-slate-400 '} href={'/about'}>Privacy Policy</a>
                <a className={'text-slate-400 '} href={'/about'}>Terms of Service</a>
                <a className={'text-slate-400 '} href={'/about'}>Contact</a>
            </div>
        </div>
    )
}

export default Footer;