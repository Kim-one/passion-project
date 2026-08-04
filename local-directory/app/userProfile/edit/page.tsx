'use client'
import {useAuth} from "@/app/context/ContextAuth";
import {useState, useEffect} from "react";
import { SlCamera } from "react-icons/sl";

const EditProfile = () => {
    const user = useAuth();

    return(
        <div className={'flex flex-col bg-charcoal h-full text-white max-w-full gap-8 p-6'}>
            <div className={'flex flex-col gap-2 mb-4'}>
                <div className={'border-t-2 border-t-secondary-dark w-12'}></div>
                <h1 className={'text-headline-lg'}>Edit Profile</h1>
                <p>Manage your public presence and account preferences across the Jewel of the Caribbean.</p>
            </div>
            {/* PROFILE IMAGE */}
            <section className={'space-y-6'}>
                <div className={'flex gap-1 items-center'}>
                    <div className={'bg-primary-dark w-6 h-[1px]'}></div>
                    <span className={'text-section-label text-primary-dark uppercase tracking-widest'}>Profile Picture</span>
                </div>
                <div className={'glass-section p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8'}>
                    <div className={'relative group'}>
                        <div className={'w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 border-secondary-dark rounded-full shadow-2xl'}>
                            <img src={'/images/ProfilePic.png'} alt={'Profile Picture'} className={'object-cover w-full h-full'} />
                        </div>
                        <div className={'absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer '}>
                            <SlCamera/>
                        </div>
                    </div>
                    <div className={'text-center md:text-left'}>
                        <h4 className={'font-bold text-on-surface text-lg mb-2'}>Your Avatar</h4>
                        <p className={"text-body-md text-on-surface-variant mb-6 max-w-xs"}>JPG, GIF or PNG. Max size of
                            2MB. A high-quality photo helps others recognize you in the community.</p>
                        <div className={'flex flex-wrap justify-center md:justify-start gap-4'}>
                            <button className={'px-6 py-2 bg-secondary-dark rounded-full font-bold text-on-primary-container hover:scale-105 transition-transform active:scale-95'}>
                                Upload New
                            </button>
                            <button className={'px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-bright transition-colors'}>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'space-y-6'}>
                <div className={'flex gap-1 items-center'}>
                    <div className={'bg-primary-dark w-6 h-[1px]'}></div>
                    <span className={'text-section-label text-primary-dark uppercase tracking-widest'}>Profile Profile</span>
                </div>
                <div className={'glass-section p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8'}>
                    <div className={'flex gap-3'}>
                        <div className={'flex flex-col gap-1'}>
                            <label>Display Name</label>
                            <input placeholder={user.user?.name} className={'rounded-full p-4 '}/>
                        </div>
                        <div className={'flex flex-col gap-1'}>
                            <label>Location</label>
                            <input placeholder={user.user?.parish} className={'rounded-full p-4 '}/>
                        </div>
                    </div>
                    {/*<div className={'flex flex-col'}>*/}
                    {/*    <label>Short Bio</label>*/}
                    {/*    */}
                    {/*</div>*/}
                </div>
            </section>
        </div>
    )
}

export default EditProfile;