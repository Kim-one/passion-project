'use client';
import axios from 'axios';
import {useEffect, useState} from "react";

export default function UserProfile() {
    const [data, setData] = useState();

    useEffect(() => {
        axios.get('http://localhost:8000/api/greeting')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log("Error fetching data:",error);
            })
    }, []);

    return (
        <div className={'bg-charcoal text-white'}>
            <div className={'p-8'}>
                <div className={'relative bg-no-repeat bg-cover bg-center w-full h-[250px] rounded-3xl'}
                     style={{backgroundImage: 'url(/images/ProfileBackground.png)'}}>
                    <div className={'absolute bottom-4 left-4'}>
                        <h1 className={'text-4xl font-bold mb-1'}>{data}</h1>
                        <p className={'flex items-center gap-2 text-secondary-dark font-medium'}>
                            <span className="material-symbols-outlined">verified</span>
                            Local Explorer - Kingston, Jamaica</p>
                    </div>
                    <div className={'absolute -bottom-14 right-10 size-[120px] bg-cover bg-center bg-no-repeat rounded-full border-[3px] border-green-600 shadow-2xl'}
                         style={{backgroundImage: 'url(/images/ProfilePic.png)'}}>
                    </div>
                </div>

            </div>
        </div>
    )
}