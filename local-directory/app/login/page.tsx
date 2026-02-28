'use client';
import React, {useState, useEffect} from "react";
import BusinessSkeleton from "@/app/BusinessSkeleton";
import {useRouter} from "next/navigation";

export default function LoginPage () {
    const [auth, setAuth] = useState('login');
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. The Skeleton State
    if (!mounted) {
        return <BusinessSkeleton />;
    }
    const handleToggle = (display: string) => {
        setAuth(display);
    }

    const handleSubmit = (e: React.FormEvent, destination: string) => {
        e.preventDefault();

        router.push(`/${destination}`);
    }

    return (
        <div suppressHydrationWarning className={'flex justify-center bg-charcoal'}>
            <div className={'flex flex-row w-[900px] bg-charcoal'}>
                <div style={{backgroundImage: `url(/images/pool.webp)`}}
                     className={'flex items-center justify-center w-[550px] bg-center bg-cover bg-no-repeat'}>
                    <div className={'p-8 max-w-7xl'}>
                        <p className={'text-white text-6xl font-bold'}>Experience the heart of Jamaica.</p>
                        <p className={'text-white text-sm font-semibold'}>Discover the island's best kept secrets, from roadside jerk stands to hidden turquoise lagoon.</p>
                    </div>
                </div>
                <div className={'flex justify-center items-center p-6 bg-[#121212]'}>
                    <div className={'flex flex-col justify-center p-[20px] gap-3'}>
                        <h1 className={'text-yellow-300 text-3xl font-bold'}>Join the local 876 Explore Community</h1>
                        <p className={'text-white text-md'}>Connect with local businesses and island favorites</p>
                        <div className={'flex items-center justify-center bg-charcoal rounded-full w-[400px] h-12 p-1'}>
                            <label className={`${auth === 'login' ? 'bg-[#2a2a2a]' : ''} flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-white/50 text-sm font-medium`}>
                                <span>Login</span>
                                <input type={'radio'} onChange={() => handleToggle('login')} className={'hidden w-0'} name={'auth'} value={'login'}/>
                            </label>
                            <label className={`${auth === 'register' ? 'bg-[#2a2a2a]' : ''} flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-white/50 text-sm font-medium`}>
                                <span>Register</span>
                                <input type={"radio"} onChange={() => handleToggle('register')} name={'auth'} value={'register'} className={'hidden w-0'}/>
                            </label>
                        </div>
                        {auth === 'login' ? (
                            <form className={'text-white space-y-5'} onSubmit={(e) => handleSubmit(e, 'userProfile')}>
                                <div className={'space-y-2'}>
                                    <label className={'text-sm font-medium inline-block ml-1'}>Email Address</label>
                                    <input type={'email'} placeholder={'name@example.com'}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
                                </div>
                                <div className={'space-y-2'}>
                                    <div className={'flex items-center justify-between'}>
                                        <label className={'text-sm font-medium inline-block ml-1'}>
                                            Password
                                        </label>
                                        <a href={'/'} className={'text-xs hover:underline font-medium text-secondary-dark'}>Forgot Password</a>
                                    </div>
                                    <input type={'password'} placeholder={'password'}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
                                </div>
                                <button type={'submit'} className={'bg-secondary-dark rounded-full w-full text-black py-4 text-lg font-bold mt-4'}>Sign In</button>
                            </form>
                        ) : (
                            <form className={'text-white space-y-5'} onSubmit={(e) => {e.preventDefault();handleToggle('login')}}>
                                <div className={'flex justify-between gap-4'}>
                                    <div className={'space-y-2'}>
                                        <label className={'text-sm font-medium inline-block ml-1'}>First Name</label>
                                        <input type={'text'} placeholder={'First Name'}
                                               className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
                                    </div>
                                    <div className={'space-y-2'}>
                                        <label className={'text-sm font-medium inline-block ml-1'}>Last Name</label>
                                        <input type={'text'} placeholder={'Last Name'}
                                               className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
                                    </div>
                                </div>
                                <div className={'space-y-2'}>
                                    <label className={'font-medium text-sm inline-block ml-1'}>Address</label>
                                    <input type={'text'} placeholder={'Parish, Country'}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
                                </div>
                                <div className={'space-y-2'}>
                                    <label className={'text-sm font-medium inline-block ml-1'}>Email Address</label>
                                    <input type={'email'} placeholder={'name@example.com'}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
                                </div>
                                <div className={'space-y-2'}>
                                    <div className={'flex items-center justify-between'}>
                                        <label className={'text-sm font-medium inline-block ml-1'}>
                                            Password
                                        </label>
                                    </div>
                                    <input type={'password'}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
                                </div>
                                <button type={'submit'}
                                        className={'bg-secondary-dark rounded-full w-full text-black py-4 text-lg font-bold mt-4'}>Register</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}