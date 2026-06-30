'use client'
import {useEffect, useState} from "react";
import Link from "next/link";
// import {FILTER_BUSINESSES} from "@/app/MockData";
import StarRating from "@/app/StarRating";
import {Business} from "@/app/Business";
import {CiLocationOn} from "react-icons/ci";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {api} from "@/app/context/ContextAuth";

// const api = axios.create({
//     baseURL: 'https://web-production-0fb7e.up.railway.app',
//     withCredentials: true,
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'Accept': 'application/json',
//     }
// });


const PARISHES = [
    {
        id: 1,
        parish: 'St. Ann',
        options: 200
    },{
        id: 2,
        parish: 'Manchester',
        options: 40
    },{
        id: 3,
        parish: 'Clarendon',
        options: 67
    },{
        id: 4,
        parish: 'Westmoreland',
        options: 106
    },{
        id: 5,
        parish: 'Portland',
        options: 120
    },{
        id: 6,
        parish: 'Trelawny',
        options: 23
    },{
        id: 7,
        parish: 'Hanover',
        options: 10
    },{
        id: 8,
        parish: 'St. Thomas',
        options: 76
    },{
        id: 9,
        parish: 'St. Mary',
        options: 200
    },{
        id: 10,
        parish: 'St. James',
        options: 200
    },{
        id: 11,
        parish: 'St. Elizabeth',
        options: 200
    },{
        id: 12,
        parish: 'St. Catherine',
        options: 200
    },{
        id: 13,
        parish: 'St. Andrew',
        options: 200
    },{
        id: 14,
        parish: 'Kingston',
        options: 200
    },
]
const FILTERS = ['Trending', 'Highly Rated','Recently Added', '$0 - $100']

const Discoveries = () => {
    const [parish, setParish] = useState<string | null>(null);
    const [filter, setFilter] = useState('Trending')
    const [currPage, setCurrPage] = useState(1)
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([])

    useEffect(() => {
        const fetchAllBusiness = async () => {
            try{
                const response = await api.get('api/businesses');
                console.log(response.data);
                setAllBusinesses(response.data);
            } catch (err){
                console.log('Error fetching businesses: ', err)
            }
        }
        fetchAllBusiness();
    }, []);

    const parishCounts = allBusinesses.reduce((acc, biz) => {
        const p = biz.parish;

        if (biz.parish) acc[biz.parish] = (acc[biz.parish] || 0) + 1; return acc;
    }, {} as Record<string, number>);

    const parishesWithCounts = PARISHES.map(p => ({
        ...p,
        options: parishCounts[p.parish] || 0,
    }));

    const parishes = Object.entries(parishCounts)
        .map(([name, count]) => ({name, count}))
        .sort((a, b) => b.count - a.count);

    const filteredBusinesses = parish
        ? allBusinesses.filter(b => b.parish === parish)
        : allBusinesses;

    const BUSINESS_PER_PAGE = 6
    // const total_pages = Math.ceil(FILTER_BUSINESSES.length / BUSINESS_PER_PAGE)
    // const startIndex = (currPage - 1) * BUSINESS_PER_PAGE
    // const endIndex = startIndex + BUSINESS_PER_PAGE
    // const currentBusinesses = FILTER_BUSINESSES.slice(startIndex, endIndex);
    const total_pages = Math.ceil(filteredBusinesses.length / BUSINESS_PER_PAGE);
    const startIndex = (currPage - 1) * BUSINESS_PER_PAGE;
    const endIndex = startIndex + BUSINESS_PER_PAGE;
    const currentBusinesses = filteredBusinesses.slice(startIndex, endIndex);

    console.log("All Businesses",currentBusinesses);


    return (
        <div className={'bg-charcoal h-full text-white max-w-full mx-auto flex gap-8 p-6'}>
            {/*SIDEBAR*/}
            <aside className={''}>
                <section className={'flex flex-col gap-8 w-72'}>
                    <div className={'flex justify-between tracking-tight text-sm text-gray-600 uppercase'}>
                        <p className={'text-xs font-black uppercase tracking-widest text-slate-500'}>Parishes</p>
                        <button className={'text-secondary-dark text-xs font-bold hover:underline'}>Clear</button>
                    </div>
                    <div className={'flex flex-col gap-1'}>
                        {parishesWithCounts.map((item) => (
                            <label key={item.id}
                                   onClick={() => setParish(item.parish)}
                                   className={`flex items-center gap-3 p-3 rounded-xl ${parish === item.parish ? 'bg-secondary-dark/10 border border-secondary-dark/20' : 'bg-surface-darker'}  cursor-pointer group`}>
                                <span className={"material-symbols-outlined !text-sm text-slate-400"}>location_on</span>
                                <span className={`${parish === item.parish ? 'font-bold text-secondary-dark' : 'font-medium'} text-sm `}>{item.parish}</span>
                                <span className={`${parish === item.parish ? 'bg-secondary-dark text-background-darker px-1.5 rounded-md font-bold' : 'text-slate-500'} ml-auto text-xs `}>{item.options}</span>
                            </label>
                        ))}
                    </div>
                </section>
            </aside>
            <div className={'flex-1'}>
                <div className={'flex flex-col gap-6 mb-12'}>
                    <div className={'flex flex-wrap items-end justify-between gap-4'}>
                        <div>
                            <h2 className={'text-4xl lg:text-5xl font-black tracking-tight mb-2'}>Local
                                <span className={'italic text-secondary-dark'}> Excellence</span></h2>
                            <p className={'text-slate-500 max-w-lg'}>Handpicked selection of the most authentic businesses across 14 parishes of Jamaica.</p>
                        </div>
                        <div className={'flex items-center gap-2 bg-surface-dark p-1 rounded-xl'}>
                            <button className={'p-2 rounded-lg bg-background-dark text-primary shadow-lg'}>
                                <span className="material-symbols-outlined">grid_view</span>
                            </button>
                            <button className={'p-2 rounded-lg hover:bg-background-dark text-slate-500 transition-colors'}>
                                <span className="material-symbols-outlined">map</span>
                            </button>
                        </div>
                    </div>
                    <div className={'flex flex-wrap gap-3'}>
                        {FILTERS.map((item,index) => (
                            <button onClick={() => setFilter(item)} key={index}
                                    className={`flex items-center gap-2 ${filter === item ? 'bg-secondary-dark text-background-darker' : 'bg-surface-darker text-white hover:bg-slate-800'}  px-4 py-1.5 rounded-full text-sm font-bold transition-all`}>
                                {item}
                                {item === 'Trending' &&(
                                    <span className={"material-symbols-outlined text-lg fill-bolt"}>bolt</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8'}>
                    {currentBusinesses.map((item)=>(
                        <article key={item.id} className={'group relative flex flex-col rounded-xl overflow-hidden border border-white/5 hover:border-secondary-dark/50 transition-all hover:translate-y-[4px]'}>
                            <div className={'relative h-64 w-full overflow-hidden'}>
                                <div className={'absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110'}
                                     style={{backgroundImage: `url(https://pub-b83351aa0dd34354a7dc8614f98ab703.r2.dev/${item.images[0].path})`}}></div>
                                <div className={'absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80'}></div>
                                <div className={'absolute top-4 left-4 bg-secondary-dark text-background-dark text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter'}>
                                    {item.featured &&(<p>Featured</p>)}
                                </div>
                                <button className={'absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white hover:text-secondary-dark transition-color'}>
                                    <span className="material-symbols-outlined">favorite</span>
                                </button>
                                {/*RATING - STARS*/}
                                <div className={'absolute bottom-4 left-4 flex gap-1'}>
                                    <StarRating rating={item.rating} /> <span className={'text-slate-300 text-xs'}>({item.reviewCount})</span>
                                </div>
                            </div>
                            <div className={'p-6 flex flex-col flex-1'}>
                                <div className={'flex justify-between items-start gap-4 mb-2'}>
                                    <h3 className={'text-xl font-bold group-hover:text-secondary-dark transition-colors'}>{item.businessName}</h3>
                                    <span className={"bg-primary-dark/20 text-primary-dark text-[10px] font-black uppercase py-1 px-2 rounded-md"}>{item.category}</span>
                                </div>
                                <p className={'text-sm text-slate-400 mb-6 flex items-center gap-1'}>
                                    <CiLocationOn className={'text-sm'} />
                                    {item.city}, {item.parish}
                                </p>
                                <p className={'text-sm text-slate-300 line-clamp-2 mb-8 flex-1 italic'}>
                                    {item.description &&(
                                        <span>"{item.description}"</span>
                                    )}
                                </p>
                                <Link href={`/business/${item.slug}`} className={'w-full bg-secondary-dark text-background-dark py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2'}>
                                    View Details <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
                <div className={'mt-16 flex items-center justify-center gap-4'}>
                    <button disabled={currPage === 1}
                            onClick={() => setCurrPage(prev => prev - 1)}
                            className={'h-12 w-12 flex items-center justify-center rounded-xl bg-surface-darker border border-white/5 text-slate-400 hover:text-secondary-dark hover:border-secondary-dark/50 transition-all disabled:opacity-40'}>
                        <IoIosArrowBack />
                    </button>
                    <div className={'flex items-center gap-2'}>
                        {Array.from({length: total_pages}, (_, index) => {
                            const page = index + 1;
                            return(
                                <button key={page}
                                        onClick={() => setCurrPage(page)}
                                        className={`h-12 w-12 rounded-xl transition-all font-bold
                                        ${currPage === page ? 'bg-secondary-dark' : 'bg-surface-dark border border-white/5 hover:border-primary/50 transition-all'}`}>
                                    {page}
                                </button>
                            )
                        })}
                    </div>
                    {/*<div className={'flex items-center gap-2'}>*/}
                    {/*    <button className={'h-12 w-12 rounded-xl bg-secondary-dark transition-all font-bold'}>1</button>*/}
                    {/*    <button className={'h-12 w-12 rounded-xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-all font-bold'}>2</button>*/}
                    {/*    <button className={'h-12 w-12 rounded-xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-all font-bold'}>3</button>*/}
                    {/*    <span className={'mx-2 text-slate-600'}>...</span>*/}
                    {/*    <button className={'h-12 w-12 rounded-xl bg-surface-dark border border-white/5 hover:border-primary/50 transition-all font-bold'}>12</button>*/}
                    {/*</div>*/}
                    <button disabled={currPage === total_pages}
                            onClick={() => setCurrPage(prev => prev+ 1)}
                            className={`h-12 w-12 flex items-center justify-center rounded-xl bg-surface-darker border border-white/5 text-slate-400 hover:text-secondary-dark hover:border-secondary-dark/50 transition-all disabled:opacity-40`}>
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Discoveries;