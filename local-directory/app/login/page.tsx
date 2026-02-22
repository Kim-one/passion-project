'use client';
import {useState} from "react";

export default function loginPage () {
    const [auth, setAuth] = useState('login');

    const handleChange = (display: string) => {
        setAuth(display);
    }

    return (
        <div suppressHydrationWarning className={'flex justify-center bg-charcoal '}>
            <div className={'flex flex-row h-[500px] w-[900px] bg-charcoal'}>
                <div style={{backgroundImage: `url(/images/pool.webp)`}}
                     className={'flex items-center justify-center w-[550px] bg-center bg-cover bg-no-repeat'}>
                    <div className={'p-8 max-w-7xl'}>
                        <p className={'text-white text-5xl font-bold'}>Experience the heart of Jamaica.</p>
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
                                <input type={'radio'} onChange={() => handleChange('login')} className={'hidden w-0'} name={'auth'} value={'login'}/>
                            </label>
                            <label className={`${auth === 'register' ? 'bg-[#2a2a2a]' : ''} flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-white/50 text-sm font-medium`}>
                                <span>Register</span>
                                <input type={"radio"} onChange={() => handleChange('register')} name={'auth'} value={'register'} className={'hidden w-0'}/>
                            </label>
                        </div>
                        {auth === 'login' && (
                            <div className={'text-white'}>
                                <div className={'flex flex-col'}>
                                    <label>Email</label>
                                    <input type={'text'} className={'border border-white p-2 rounded-2xl'}/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}