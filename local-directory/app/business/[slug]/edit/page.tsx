'use client'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Business} from "@/app/Business";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

const Edit =  ({params}:{params: Promise<{slug: string}>}) => {
    const [business, setBusiness] = useState<Business>();

    useEffect(() => {
        const editBusiness = async () => {
            try{
                const {slug} = await params;
                const response = await api.get(`api/business/${slug}`);
                setBusiness(response.data);
                console.log(business);
            } catch (err){
                console.log("Error fetching business:", err);
            }
        }
        editBusiness();
    }, [params]);

    return (
        <div suppressHydrationWarning className={'bg-charcoal h-screen flex flex-col items-center overflow-y-auto'}>
            <div className={'flex flex-col  items-center'}>
                <div className={'flex flex-col mx-30 gap-2 py-10 px-80  text-center'}>
                    <h1 className={'text-primary-dark uppercase tracking-widest'}>Empowering Local Gems</h1>
                    <h1 className={'text-white text-5xl font-black tracking-tighter'}>List Your Business</h1>
                    <p className={'text-slate-300 text-center'}>Join our vibrant community of local creatures and entrepreneurs.
                        Showcase your venture to thousands of residents and visitors across the island.
                    </p>
                </div>
                <form
                      className={'flex flex-col bg-surface-form-light text-white gap-6 p-10 border border-surface-dark w-[800px] rounded-2xl'}>
                    <div className={'flex justify-between'}>
                        <div className={'flex flex-col gap-2 w-[350px]'}>
                            <label className={'uppercase font-semibold text-sm'}>Business Name</label>
                            <input type={'text'} name={''}
                                   disabled
                                   // value={formData.businessName}
                                   // onChange={handleChange}
                                   placeholder={business?.businessName} className={'border border-[#564f39] p-3 w-full rounded-3xl'}/>
                            {/*<p>{error}</p>*/}
                        </div>
                        <div className={'flex flex-col gap-2 w-[350px]'}>
                            <label className={'uppercase font-semibold text-sm'}>Category</label>
                            <input type={'text'} name={'category'}
                                   // value={formData.category}
                                   // onChange={handleChange}
                                   placeholder={'Choose a Category'} className={'border border-[#564f39] p-3 w-full rounded-3xl'}/>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'flex justify-between text-sm uppercase font-semibold text-sm'}>
                            THE STORY
                            <span className={'text-xs lowercase'}>Tell your unique tale</span>
                        </label>
                        <textarea name={'description'}
                                  // value={formData.description} onChange={handleChange}
                                  className={'border border-[#564f39] rounded-3xl w-full p-3 resize-none h-[150px]'}
                                  placeholder={'Tell us the heart of your business story...What makes your place special?'}></textarea>
                    </div>
                    <div className={'flex flex-row gap-4'}>
                        <div className={'flex flex-col gap-2 w-[450px]'}>
                            <label className={'uppercase font-semibold text-sm'}>
                                Location Address
                            </label>
                            <input type={"text"} name={'streetAddress'}
                                   // value={formData.streetAddress} onChange={handleChange}
                                   placeholder={'Street Address, building name'}
                                   className={'border border-[#564f39] p-3 w-full rounded-3xl'}
                            />
                        </div>
                        <div className={'flex flex-col gap-2 w-[200px]'}>
                            <label className={'uppercase font-semibold text-sm'}>City</label>
                            <input type={'text'} name={'city'}
                                   // value={formData.city}
                                   // onChange={handleChange}
                                   placeholder={'e.g. Kingston'}
                                   className={'border border-[#564f39] p-3 w-full rounded-3xl'}/>
                        </div>
                        <div className={'flex flex-col gap-2 w-[330px]'}>
                            <label className={'uppercase text-sm font-semibold'}>Parish</label>
                            <input type={'text'} placeholder={'Choose a Parish'}
                                   name={'parish'}
                                   // value={formData.parish}
                                   // onChange={handleChange}
                                   className={'border border-[#564f39] p-3 w-full rounded-3xl'}/>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2 pb-12 border-b border-[#564f39]'}>
                        <label className={'uppercase text-sm font-semibold'}>Showcase Photos</label>
                        <div className={'flex items-center justify-center w-full border-2 border-dashed border-[#564f39] h-[400px] rounded-3xl'}>
                            <p>Drag and drop your best shots.</p>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2 mb-12'}>
                        <p className={'uppercase text-sm font-semibold'}>Popular Tags</p>
                        <div className={'flex flex-row gap-2'}>
                            <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>
                            <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>
                            <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>
                            <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>
                        </div>
                    </div>
                    <div className={'flex justify-between'}>
                        <div className={'flex items-center justify-center gap-2'}>
                            <div className={'flex items-center justify-center rounded-full size-5 bg-primary-dark/50'}>
                                <span className="material-symbols-outlined font-bold text-primary-dark" style={{fontSize:18}}>check</span>
                            </div>
                            <p>I agree to local business community guidelines</p>
                        </div>
                        <div className={'w-[210px]'}>
                            <button type={'submit'}
                                    className={'w-full flex items-center justify-center bg-secondary-dark rounded-full text-black font-black text-lg h-14 cursor-pointer hover:scale-105'}>
                                Submit for Review
                                <span className="material-symbols-outlined">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Edit;