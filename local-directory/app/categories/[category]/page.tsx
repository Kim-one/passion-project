'use client'
import {api} from '@/app/context/ContextAuth'
import {useEffect, useState} from "react";
import {Business} from "@/app/Business";
import {useParams} from "next/navigation";
import { GiKnifeFork } from "react-icons/gi";
const Categories =  () => {
    const params = useParams();
    const category = params.category as string;
    const [businesses, setBusinesses]=useState<Business[]>([]);

    useEffect(() => {
        if (!category) return;
        const fetchBusiness = async () => {
            try {
                const response = await api.get(`/api/businesses/category/${category}`);
                setBusinesses(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchBusiness();
    }, [category]);

    return (
        <div className={'bg-charcoal h-full text-white max-w-full mx-auto flex gap-8 p-6'}>
            <aside className={''}>
                <section className={'flex flex-col gap-8 w-72'}>
                    <div className={'flex justify-between tracking-tight text-sm text-gray-600 uppercase'}>
                        <p className={'text-xs font-black uppercase tracking-widest text-slate-500'}>Categories</p>
                        {/*<button className={'text-secondary-dark text-xs font-bold hover:underline'}>Clear</button>*/}
                    </div>
                    <div className={'flex flex-col gap-1'}>
                        {/*{PARISHES.map((item) => (*/}
                        {/*    <label key={item.id}*/}
                        {/*           onClick={() => setParish(item.parish)}*/}
                        {/*           className={`flex items-center gap-3 p-3 rounded-xl ${parish === item.parish ? 'bg-secondary-dark/10 border border-secondary-dark/20' : 'bg-surface-darker'}  cursor-pointer group`}>*/}
                        {/*        <span className={"material-symbols-outlined !text-sm text-slate-400"}>location_on</span>*/}
                        {/*        <span className={`${parish === item.parish ? 'font-bold text-secondary-dark' : 'font-medium'} text-sm `}>{item.parish}</span>*/}
                        {/*        <span className={`${parish === item.parish ? 'bg-secondary-dark text-background-darker px-1.5 rounded-md font-bold' : 'text-slate-500'} ml-auto text-xs `}>{item.options}</span>*/}
                        {/*    </label>*/}
                        {/*))}*/}
                    </div>
                </section>
            </aside>
            {businesses.length > 0 && businesses.map(businesses => (
                <div key={businesses.id}>
                    {businesses.businessName}
                </div>
            ))}
        </div>
    )
}

export default Categories;