'use client';
import React, { useState, useEffect } from "react";
import BusinessSkeleton from "@/app/BusinessSkeleton";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/ContextAuth";

// Configure Axios globally outside the component cycle
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

export default function LoginPage () {
    const { setUser } = useAuth();
    const [auth, setAuth] = useState('login');
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const [registrationData, setRegistrationData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        password: '',
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <BusinessSkeleton />;
    }

    const handleToggle = (display: string) => {
        setAuth(display);
    }

    const handleSubmit = async (e: React.FormEvent, destination: string, mode: string) => {
        e.preventDefault();

        const submissionData = mode === 'login' ? loginData : registrationData;

        // Match up with Laravel configuration
        const modeURL = mode === 'login'
            ? 'http://localhost:8000/login'
            : 'http://localhost:8000/api/register';

        try {
            // 1. Fetch cookie (Always do this before a state-changing POST request)
            await axios.get('http://localhost:8000/sanctum/csrf-cookie');

            // 2. Execute Auth request
            const response = await axios.post(modeURL, submissionData);
            console.log(response.data);

            // 3. Update global application state
            if (response.data?.user) {
                const u = response.data.user;
                setUser({
                    name: u.firstName ?? u.first_name ?? u.name,
                    email: u.email,
                });
            }

            // 4. Redirect user
            router.push(`/${destination}`);
        } catch (error: any) {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.error("Server Error Data:", error.response.data);
                console.error("Server Status:", error.response.status);
            } else if (error.request) {
                // The request was made but no response was received (Classic CORS / Server Down)
                console.error("No response received. Check your Laravel server or CORS settings:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, mode: string) => {
        const { name, value } = e.target;
        if (mode === 'register') {
            setRegistrationData((prev) => ({
                ...prev,
                [name]: value
            }));
        } else {
            setLoginData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div suppressHydrationWarning className={'flex justify-center bg-charcoal'}>
            <div className={'flex flex-row w-[900px] bg-charcoal'}>
                {/* Visual Side Panel */}
                <div style={{ backgroundImage: `url(/images/pool.webp)` }}
                     className={'flex items-center justify-center w-[550px] bg-center bg-cover bg-no-repeat'}>
                    <div className={'p-8 max-w-7xl'}>
                        <p className={'text-white text-6xl font-bold'}>Experience the heart of Jamaica.</p>
                        <p className={'text-white text-sm font-semibold'}>Discover the island's best kept secrets, from roadside jerk stands to hidden turquoise lagoon.</p>
                    </div>
                </div>

                {/* Form Wrapper */}
                <div className={'flex justify-center items-center p-6 bg-[#121212]'}>
                    <div className={'flex flex-col justify-center p-[20px] gap-3'}>
                        <h1 className={'text-yellow-300 text-3xl font-bold'}>Join the local 876 Explore Community</h1>
                        <p className={'text-white text-md'}>Connect with local businesses and island favorites</p>

                        {/* Toggle Switches */}
                        <div className={'flex items-center justify-center bg-charcoal rounded-full w-[400px] h-12 p-1'}>
                            <label className={`${auth === 'login' ? 'bg-[#2a2a2a]' : ''} flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-white/50 text-sm font-medium`}>
                                <span>Login</span>
                                <input type={'radio'} onChange={() => handleToggle('login')} className={'hidden w-0'} name={'auth'} value={'login'} checked={auth === 'login'}/>
                            </label>
                            <label className={`${auth === 'register' ? 'bg-[#2a2a2a]' : ''} flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-white/50 text-sm font-medium`}>
                                <span>Register</span>
                                <input type={"radio"} onChange={() => handleToggle('register')} name={'auth'} value={'register'} className={'hidden w-0'} checked={auth === 'register'}/>
                            </label>
                        </div>

                        {/* Login Form Section */}
                        {auth === 'login' ? (
                            <form key={'login-form'} className={'text-white space-y-5'} onSubmit={(e) => handleSubmit(e, 'userProfile', 'login')}>
                                <div className={'space-y-2'}>
                                    <label className={'text-sm font-medium inline-block ml-1'}>Email Address</label>
                                    <input type={'email'} placeholder={'name@example.com'} name={'email'} value={loginData.email}
                                           onChange={(e) => handleChange(e, 'login')}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'} required />
                                </div>
                                <div className={'space-y-2'}>
                                    <div className={'flex items-center justify-between'}>
                                        <label className={'text-sm font-medium inline-block ml-1'}>Password</label>
                                        <a href={'/'} className={'text-xs hover:underline font-medium text-secondary-dark'}>Forgot Password</a>
                                    </div>
                                    <input type={'password'} name={'password'} value={loginData.password}
                                           onChange={(e) => handleChange(e, 'login')}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'} required />
                                </div>
                                <button type={'submit'} className={'bg-secondary-dark rounded-full w-full text-black py-4 text-lg font-bold mt-4'}>Sign In</button>
                            </form>
                        ) : (
                            /* Registration Form Section */
                            <form key={'registration-form'} className={'text-white space-y-5'} onSubmit={(e) => handleSubmit(e, 'userProfile', 'register')}>
                                <div className={'flex justify-between gap-4'}>
                                    <div className={'space-y-2'}>
                                        <label className={'text-sm font-medium inline-block ml-1'}>First Name</label>
                                        <input type={'text'} placeholder={'First Name'} name={'firstName'} value={registrationData.firstName}
                                               onChange={(e) => handleChange(e, 'register')}
                                               className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'} required />
                                    </div>
                                    <div className={'space-y-2'}>
                                        <label className={'text-sm font-medium inline-block ml-1'}>Last Name</label>
                                        <input type={'text'} placeholder={'Last Name'} name={'lastName'} value={registrationData.lastName}
                                               onChange={(e) => handleChange(e, 'register')}
                                               className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'} required />
                                    </div>
                                </div>
                                <div className={'space-y-2'}>
                                    <label className={'font-medium text-sm inline-block ml-1'}>Address</label>
                                    <input type={'text'} placeholder={'Parish, Country'} name={'address'} value={registrationData.address}
                                           onChange={(e) => handleChange(e, 'register')}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'} required />
                                </div>
                                <div className={'space-y-2'}>
                                    <label className={'text-sm font-medium inline-block ml-1'}>Email Address</label>
                                    <input type={'email'} placeholder={'name@example.com'} name={'email'} value={registrationData.email}
                                           onChange={(e) => handleChange(e, 'register')}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'} required />
                                </div>
                                <div className={'space-y-2'}>
                                    <label className={'text-sm font-medium inline-block ml-1'}>Password</label>
                                    <input type={'password'} name={'password'} value={registrationData.password}
                                           onChange={(e) => handleChange(e, 'register')}
                                           className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'} required />
                                </div>
                                <button type={'submit'} className={'bg-secondary-dark rounded-full w-full text-black py-4 text-lg font-bold mt-4'}>Register</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}




// 'use client';
// import React, {useState, useEffect} from "react";
// import BusinessSkeleton from "@/app/BusinessSkeleton";
// import {useRouter} from "next/navigation";
// import axios from "axios";
// import {useAuth} from "@/app/context/ContextAuth";
//
// export default function LoginPage () {
//     const { setUser} = useAuth();
//     const [auth, setAuth] = useState('login');
//     const [mounted, setMounted] = useState(false);
//     const router = useRouter();
//     const [registrationData, setRegistrationData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         address: '',
//         password: '',
//     });
//     const [loginData, setLoginData] = useState({
//         email: '',
//         password: '',
//     });
//
//     useEffect(() => {
//         setMounted(true);
//     }, []);
//
//     if (!mounted) {
//         return <BusinessSkeleton />;
//     }
//     const handleToggle = (display: string) => {
//         setAuth(display);
//     }
//
//
//     const handleSubmit = async (e: React.FormEvent, destination: string, mode: string) => {
//         e.preventDefault();
//         axios.defaults.withCredentials = true;
//         axios.defaults.withXSRFToken = true;
//         const submissionData = mode === 'login' ? loginData : registrationData;
//         const modeURL = mode === 'login' ? 'http://localhost:8000/login' : 'http://localhost:8000/api/register';
//         try{
//             await axios.get('http://localhost:8000/sanctum/csrf-cookie');
//
//             const response = await axios.post(modeURL, submissionData);
//             console.log(response.data);
//             setUser(response.data.user);
//             router.push(`/${destination}`);
//         } catch (error) {
//             console.log(error);
//         }
//     }
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>, mode:string) => {
//         const {name, value} = e.target;
//         if(mode==='register'){
//             setRegistrationData((prev) => ({
//                 ...prev,
//                 [name]: value
//             }));
//         } else{
//             setLoginData((prev) => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };
//
//     return (
//         <div suppressHydrationWarning className={'flex justify-center bg-charcoal'}>
//             <div className={'flex flex-row w-[900px] bg-charcoal'}>
//                 <div style={{backgroundImage: `url(/images/pool.webp)`}}
//                      className={'flex items-center justify-center w-[550px] bg-center bg-cover bg-no-repeat'}>
//                     <div className={'p-8 max-w-7xl'}>
//                         <p className={'text-white text-6xl font-bold'}>Experience the heart of Jamaica.</p>
//                         <p className={'text-white text-sm font-semibold'}>Discover the island's best kept secrets, from roadside jerk stands to hidden turquoise lagoon.</p>
//                     </div>
//                 </div>
//                 <div className={'flex justify-center items-center p-6 bg-[#121212]'}>
//                     <div className={'flex flex-col justify-center p-[20px] gap-3'}>
//                         <h1 className={'text-yellow-300 text-3xl font-bold'}>Join the local 876 Explore Community</h1>
//                         <p className={'text-white text-md'}>Connect with local businesses and island favorites</p>
//                         <div className={'flex items-center justify-center bg-charcoal rounded-full w-[400px] h-12 p-1'}>
//                             <label className={`${auth === 'login' ? 'bg-[#2a2a2a]' : ''} flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-white/50 text-sm font-medium`}>
//                                 <span>Login</span>
//                                 <input type={'radio'} onChange={() => handleToggle('login')} className={'hidden w-0'} name={'auth'} value={'login'}/>
//                             </label>
//                             <label className={`${auth === 'register' ? 'bg-[#2a2a2a]' : ''} flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-white/50 text-sm font-medium`}>
//                                 <span>Register</span>
//                                 <input type={"radio"} onChange={() => handleToggle('register')} name={'auth'} value={'register'} className={'hidden w-0'}/>
//                             </label>
//                         </div>
//                         {auth === 'login' ? (
//                             <form key={'login-form'} className={'text-white space-y-5'} onSubmit={(e) => handleSubmit(e, 'userProfile', 'login')}>
//                                 <div className={'space-y-2'}>
//                                     <label className={'text-sm font-medium inline-block ml-1'}>Email Address</label>
//                                     <input type={'email'} placeholder={'name@example.com'} name={'email'} value={loginData.email}
//                                            onChange={(e) => handleChange(e, 'login')}
//                                            className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
//                                 </div>
//                                 <div className={'space-y-2'}>
//                                     <div className={'flex items-center justify-between'}>
//                                         <label className={'text-sm font-medium inline-block ml-1'}>
//                                             Password
//                                         </label>
//                                         <a href={'/'} className={'text-xs hover:underline font-medium text-secondary-dark'}>Forgot Password</a>
//                                     </div>
//                                     <input type={'password'} name={'password'} value={loginData.password}
//                                            onChange={(e) => handleChange(e, 'login')}
//                                            className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
//                                 </div>
//                                 <button type={'submit'} className={'bg-secondary-dark rounded-full w-full text-black py-4 text-lg font-bold mt-4'}>Sign In</button>
//                             </form>
//                         ) : (
//                             <form key={'registration-form'} className={'text-white space-y-5'} onSubmit={(e) => handleSubmit(e, 'login', 'register')}>
//                                 <div className={'flex justify-between gap-4'}>
//                                     <div className={'space-y-2'}>
//                                         <label className={'text-sm font-medium inline-block ml-1'}>First Name</label>
//                                         <input type={'text'} placeholder={'First Name'} name={'firstName'} value={registrationData.firstName}
//                                                onChange={(e) =>handleChange(e, 'register')}
//                                                className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
//                                     </div>
//                                     <div className={'space-y-2'}>
//                                         <label className={'text-sm font-medium inline-block ml-1'}>Last Name</label>
//                                         <input type={'text'} placeholder={'Last Name'} name={'lastName'} value={registrationData.lastName}
//                                                onChange={(e) =>handleChange(e, 'register')}
//                                                className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
//                                     </div>
//                                 </div>
//                                 <div className={'space-y-2'}>
//                                     <label className={'font-medium text-sm inline-block ml-1'}>Address</label>
//                                     <input type={'text'} placeholder={'Parish, Country'} name={'address'} value={registrationData.address}
//                                            onChange={(e) =>handleChange(e, 'register')}
//                                            className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
//                                 </div>
//                                 <div className={'space-y-2'}>
//                                     <label className={'text-sm font-medium inline-block ml-1'}>Email Address</label>
//                                     <input type={'email'} placeholder={'name@example.com'} name={'email'} value={registrationData.email}
//                                            onChange={(e) =>handleChange(e, 'register')}
//                                            className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
//                                 </div>
//                                 <div className={'space-y-2'}>
//                                     <div className={'flex items-center justify-between'}>
//                                         <label className={'text-sm font-medium inline-block ml-1'}>
//                                             Password
//                                         </label>
//                                     </div>
//                                     <input type={'password'} name={'password'} value={registrationData.password}
//                                            onChange={(e) =>handleChange(e, 'register')}
//                                            className={'w-full bg-[#2a2a2a] p-2 rounded-2xl text-white/80'}/>
//                                 </div>
//                                 <button type={'submit'}
//                                         className={'bg-secondary-dark rounded-full w-full text-black py-4 text-lg font-bold mt-4'}>Register</button>
//                             </form>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }