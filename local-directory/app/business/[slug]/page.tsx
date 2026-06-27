import {FILTER_BUSINESSES} from "@/app/MockData";
import {MdOutlineVerified, MdSchedule, MdOutlineLocalPhone, MdPublic, MdMarkEmailUnread  } from "react-icons/md";
import { IoIosCamera } from "react-icons/io";
import {CiLocationOn} from "react-icons/ci";
import StarRating from "@/app/StarRating";
export default async function BusinessPage({params}:{params: Promise<{slug: string}>}){
    const {slug} = await params;

    const business = FILTER_BUSINESSES.find(
        b => b.slug === slug
    )
    return (
        <div className={'bg-charcoal h-full text-white max-w-full mx-auto gap-8 p-6'}>
            {/*<div className={'max-w-7xl mx-auto px-6 py-8'}></div>*/}
            <div className={'relative w-full h-[500px] rounded-xl overflow-hidden mb-12'}>
                <div className={'absolute inset-0 bg-cover bg-center'} style={{backgroundImage: `url(${business?.image})`}}></div>
                <div className={'absolute bottom-10 left-10 right-10 flex flex-col items-start gap-2'}>
                    <div className={'flex items-center gap-2 px-3 py-1 bg-secondary-dark text-background-dark rounded-full text-[10px] font-black uppercase tracking-widest'}>
                        <MdOutlineVerified /> Featured Destination
                    </div>
                    <h1 className={'text-white text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]'}>{business?.name}</h1>
                    <p className={'text-white/60 text-lg mt-4 max-w-2xl font-light'}>{business?.description}</p>
                </div>
            </div>
            <div className={'grid grid-cols-1 lg:grid-cols-12 gap-12'}>
                <div className={'lg:col-span-8 space-y-16'}>
                    <section>
                        <div className={'flex items-center gap-4 mb-6'}>
                            <span className={'h-px w-12 bg-secondary-dark'}></span>
                            <h2 className={'text-secondary-dark text-xs font-black uppercase tracking-[0.3em]'}>The Story</h2>
                        </div>
                        <h3 className={"text-4xl font-bold mb-6 tracking-tight"}>Authentic Flavors, <br/>Unrivaled Views.</h3>
                        <div className={'space-y-4 text-white/70 text-lg leading-relaxed font-light'}>
                            <p>{business?.about}</p>
                        </div>
                    </section>
                    <section>
                        <div className={'flex items-center gap-4 mb-6'}>
                            <span className={'h-px w-12 bg-secondary-dark'}></span>
                            <h2 className={'text-secondary-dark text-xs font-black uppercase tracking-[0.3em]'}>The Atmosphere</h2>
                        </div>
                        <div className={'grid grid-cols-2 md:grid-cols-3 gap-4'}>
                            {business?.gallery.map((pics, index) => (
                                <div key={index} className={'aspect-square rounded-lg overflow-hidden emerald-frame group'}>
                                    <img src={`${pics}`} alt={'Res'} className={'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'}/>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className={'flex items-center justify-between mb-8'}>
                            <div className={'flex items-center gap-4'}>
                                <span className={'h-px w-12 bg-secondary-dark'}></span>
                                <h2 className={'text-secondary-dark text-xs font-black uppercase tracking-[0.3em]'}>Guest Reviews</h2>
                            </div>
                            <button className={'text-secondary-dark text-xs font-bold uppercase border-b border-secondary-dark/30 hover:border-secondary-dark'}>Write a review</button>
                        </div>
                        <div className={'grid gap-6'}>
                            <div className={'floating-jewel p-6 rounded-xl'}>
                                <div className={'flex justify-between items-start mb-4'}>
                                    <div className={'flex items-center gap-3'}>
                                        <div className={'size-10 rounded-full bg-secondary-dark/20 flex items-center justify-center text-secondary-dark font-bold'}>SM</div>
                                        <div>
                                            <h4 className={'font-bold'}>Kim</h4>
                                            <p className={'text-xs text-white/40 italic'}>Visited June 6, 2026</p>
                                        </div>
                                    </div>
                                    <div className={'flex text-secondary-dark'}>
                                        <StarRating rating={3.3}/>
                                    </div>
                                </div>
                                <p className={'text-white/70 leading-relaxed italic'}>
                                    "The curried lobster was transformative. Eating with the sound of the waves just a few feet away is an experience I will never forget. Truly the heart of Port Antonio."</p>
                            </div>
                        </div>
                    </section>
                </div>
                <div className={'lg:col-span-4'}>
                    <div className={'sticky-sidebar space-y-6'}>
                        <div className={'floating-jewel p-8 rounded-xl flex flex-col gap-6'}>
                            <button className={'w-full bg-secondary-dark hover:bg-secondary-dark/90 text-background-dark py-4 rounded-lg font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,191,0,0.3)] transition-all hover:-translate-y-1'}>
                                Visit Website
                            </button>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex items-start gap-4"}>
                                    <CiLocationOn className={'text-secondary-dark text-md'}/>
                                    <div>
                                        <p className={'text-xs text-white/40 uppercase font-black tracking-widest mb-1'}>Location</p>
                                        <p className={'text-sm font-medium'}>1065 Barrington Street</p>
                                    </div>
                                </div>
                                <div className={"flex items-start gap-4"}>
                                    <MdSchedule className={'text-secondary-dark text-md'}/>
                                    <div>
                                        <p className={'text-xs text-white/40 uppercase font-black tracking-widest mb-1'}>Hours</p>
                                        <p className={'text-sm font-medium'}>Daily: 11:00 AM - 09:00 PM</p>
                                    </div>
                                </div>
                                <div className={"flex items-start gap-4"}>
                                    <MdOutlineLocalPhone className={'text-secondary-dark text-md'}/>
                                    <div>
                                        <p className={'text-xs text-white/40 uppercase font-black tracking-widest mb-1'}>Contact</p>
                                        <p className={'text-sm font-medium'}>+ 1 (876) 555 - 5555</p>
                                    </div>
                                </div>
                            </div>
                            <div className={'pt-4 border-t border-white/5 flex justify-center gap-6'}>
                                <a href={'#'}><MdPublic/></a>
                                <a href={'#'}><IoIosCamera/></a>
                                <a href={'#'}><MdMarkEmailUnread/></a>
                            </div>
                        </div>
                    {/*    AMENITIES*/}
                        <div className={'p-6'}>
                            <h4 className={'text-xs font-black uppercase tracking-[0.2em] mb-4 text-white/40"'}>Amenities</h4>
                            <div className={'flex flex-wrap gap-2'}>
                                <span className={'px-3 py-1 bg-white/5 rounded-full text-md font-bold border border-white/10'}>Parking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}