import {Categories} from "@/app/Categories";
import {LocalGems} from "@/app/LocalGems";
import Link from "next/link";

export default function HomePage () {
    return (
        <div className={"bg-charcoal min-h-screen min-w-full flex flex-col"}>
            <div className={'ml-5 mr-5'}>
                <div style={{ backgroundImage: `url('/images/background.png')` }}
                     className={"relative flex items-center justify-center bg-no-repeat bg-center bg-cover rounded-3xl w-full h-[500px] overflow-hidden"}>
                    <div className={"absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal"} />
                    <div className={"absolute flex flex-col gap-2 justify-center items-center h-full max-w-2xl"}>
                        <h1 className={"inline-block uppercase text-secondary-dark bg-secondary-dark/20 tracking-widest font-black py-1 px-3 border border-secondary-dark/30 rounded-full"}>
                            Discover Authentic Jamaica
                        </h1>
                        <h1 className={'text-white text-center font-black text-5xl md:text-7xl mb-8'}>
                            The Pulse of Jamaica, <br/><span className={'text-secondary-dark'}>In Your Pocket.</span>
                        </h1>
                        <div className={'w-full relative flex items-center gap-3'}>
                            <div className={'relative flex-1 items-center'} suppressHydrationWarning>
                                <span className={"material-symbols-outlined text-secondary-dark absolute left-3 top-1/2 -translate-y-1/2"}>search</span>
                                <input type={'text'}
                                       placeholder={'Find food, fun or services...'}
                                       className={'w-full text-white bg-charcoal border border-[#2C2C2E] py-3 pl-10 pr-3 rounded-xl'} />
                                <button className={'absolute right-2 top-1/2 -translate-y-1/2 border-none flex gap-3 items-center bg-secondary-dark rounded-full px-2 py-2'}>
                                    <span className={'font-semibold'}>Search</span>
                                    <span className={"material-symbols-outlined"}>arrow_right_alt</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className={'text-slate-300 mt-4 text-sm font-medium'}>
                                Popular: <span className={'text-white cursor-pointer underline decoration-secondary-dark'}>Scotchies</span>, <span className={'text-white cursor-pointer underline decoration-secondary-dark'}>Blue Hole</span>, <span className={'text-white cursor-pointer underline decoration-secondary-dark'}>Villa Rentals</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/*Explore by Categories Section*/}
            <div className={'mt-10 w-full pb-10'}>
                <div className={'flex flex-col gap-2 mx-5'}>
                    <h1 className={'text-white font-bold text-3xl'}>Explore By Category</h1>
                    <div className={'flex justify-between'}>
                        <p className={'text-slate-300 text-sm'}>Everything from street food to luxury stays</p>
                        <Link className={'flex items-center cursor-pointer text-secondary-dark text-sm font-bold'} href={'/Categories'}>
                            View All <span
                            className="material-symbols-outlined">chevron_right</span></Link>
                    </div>
                    <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}>
                        {Categories.slice(0,4).map(category => (
                            <div key={category.id} style={{backgroundImage: `url(${category.image})`}}
                                 className={'flex aspect-[1] relative overflow-hidden rounded-2xl items-end bg-no-repeat bg-center bg-cover'}>
                                <p className={'flex flex-col text-white font-bold text-2xl absolute bottom-2 left-2'}>
                                    <span className={'material-symbols-outlined text-secondary-dark'}>{category.icon}</span>
                                    {category.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/*Featured Local Gems    */}
            <div className={'py-10 bg-white/[0.02]'}>
                <div className={'flex flex-col gap-5 mx-5'}>
                    <div className={'flex justify-between items-center'}>
                        <h1 className={'text-white font-bold text-3xl'}>Featured Local Gems</h1>
                        <div className={'flex gap-4'}>
                            <div className={'flex items-center rounded-full border border-slate-600'}>
                                <span className="material-symbols-outlined text-white">chevron_backward</span>
                            </div>
                            <div className={'flex items-center rounded-full border border-slate-600'}>
                                <span className="material-symbols-outlined text-white">chevron_right</span>
                            </div>
                        </div>
                    </div>
                    <div className={'grid grid-cols-3 gap-6'}>
                        {LocalGems.slice(0, 3).map(gems => (
                            <div key={gems.id}
                                 className={'flex flex-col relative overflow-hidden text-white bg-surface-dark rounded-lg border border-white/5 aspect-[1]'}>
                                <div className={'relative h-80 overflow-hidden'}>
                                    <img src={gems.image} alt={gems.name} className={'object-cover w-full h-full'} />
                                    <div className={`${gems.label === 'Popular'
                                        ? 'bg-secondary-dark font-black text-background-dark'
                                        : 'bg-primary-dark text-white font-black'} 
                                        tracking-widest absolute top-4 left-4 rounded-full px-3 py-1 text-[10px]`}>
                                        <p className={'uppercase'}>{gems.label}</p>
                                    </div>
                                    <div className={'absolute right-4 top-4 !text-xl bg-background-dark/60 backdrop-blur-md size-10 rounded-full flex items-center justify-center text-secondary-dark cursor-pointer hover:text-background-dark hover:bg-secondary-dark'}>
                                        <span className="material-symbols-outlined !text-xl">favorite</span>
                                    </div>
                                </div>
                                <div className={'p-4'}>
                                    <div className={'flex justify-between mb-2'}>
                                        <h1 className={'text-xl font-bold text-white '}>{gems.name}</h1>
                                        <span className={'flex items-center gap-1 text-secondary-dark text-sm font-bold'}>
                                            <span className="material-symbols-outlined !text-sm fill-1">star</span>
                                            {gems.ratings}
                                        </span>
                                    </div>
                                    <p className={'text-slate-400 text-sm mb-6 line-clamp-2'}>{gems.description}</p>
                                    <div className={'flex justify-between pt-4 border-t border-slate-600'}>
                                        <div className={'flex items-center gap-2'}>
                                            <span className="material-symbols-outlined !text-sm text-slate-400">location_on</span>
                                            <p className={'text-slate-400 text-xs font-medium'}>{gems.location}</p>
                                        </div>
                                        <p className={'text-secondary-dark text-xs font-bold'}>$$$</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/*List your business*/}
            <div className={'mx-5 px-10 py-20'}>
                <div className={'max-w-7xl mx-auto relative flex flex-row gap-6 bg-secondary-dark p-10 rounded-2xl'}>
                    <div className={'flex-1 text-center md:text-left'}>
                        <h1 className={'text-4xl md:text-5xl mb-4 font-black text-background-dark'}>List Your Business Today.</h1>
                        <p className={'text-background-dark/70 text-lg font-medium max--w-lg mb-8'}>Join the largest network of Jamaican entrepreneurs and get discovered by thousands of locals and tourists every month.</p>
                        <button className={'bg-background-dark text-white rounded-xl px-10 py-4 font-bold'}>
                            Join the community
                        </button>
                    </div>
                    <div className={'flex-1 grid grid-cols-2 gap-6 w-full'}>
                        <div className={'bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center'}>
                            <p className={'text-background-dark font-black text-3xl'}>1.2k+</p>
                            <p className={'text-background/60 text-xs font-bold uppercase tracking-wider'}>Daily Users</p>
                        </div>
                        <div className={'bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center'}>
                            <p className={'text-background-dark font-black text-3xl'}>850</p>
                            <p className={'text-background-dark/60 text-xs font-bold uppercase tracking-wider'}>Businesses</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}