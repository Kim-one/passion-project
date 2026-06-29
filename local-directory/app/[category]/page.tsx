'use client'
import {api} from '@/app/context/ContextAuth'
import {useEffect, useState} from "react";
import {Business} from "@/app/Business";
const Categories = ({params}: {params: Promise<{ category: string }>}) => {
    const [businesses, setBusinesses]=useState<Business[]>([]);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const response = await api.get(`/api/businesses/${params}`);
                setBusinesses(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchBusiness();
    }, [params]);

    return (
        <div className={'bg-charcoal text-white'}>
            {businesses.length > 0 && businesses.map(businesses => (
                <div key={businesses.id}>
                    {businesses.businessName}
                </div>
            ))}
        </div>
    )
}

export default Categories;