'use client';
import {useEffect, useState} from "react";
import {useAuth, api} from "@/app/context/ContextAuth";
import {Business} from '@/app/Business';
import Link from "next/link";

// const api = axios.create({
//     baseURL: 'https://web-production-0fb7e.up.railway.app',
//     withCredentials: true,
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'Accept': 'application/json',
//     }
// });

// interface Business {
//     id: number;
//     businessName: string;
//     category: string;
//     city: string;
//     parish: string;
//     description: string;
//     slug: string;
//     verified: boolean;
// }
interface SavedPlace {
    id: number;
    business_id: number;
    business: Business
}
export default function UserProfile() {
    const {user, logout} = useAuth();
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState('business');
    const [business, setBusiness] = useState<Business[]>([]);
    const [loadingBusinesses, setLoadingBusinesses] = useState(false);
    const [savedBusinesses, setSavedBusinesses] = useState<SavedPlace[]>([]);

    useEffect(() => {
        console.log("User from context:", user);
    }, [user]);

    useEffect(() => {
        const fetchBusinesses = async () => {
            setLoadingBusinesses(true);
            try{
                const response = await api.get('/api/my-businesses');
                setBusiness(response.data);

                // const savedPlacesRes = await api.get('/api/saved-places');
                // setSavedBusinesses(savedPlacesRes.data);
                // console.log("savedPlacesRes.data:", savedPlacesRes.data);
            } catch(err){
                console.log(err);
            } finally {
                setLoadingBusinesses(false);
            }
        };
        fetchBusinesses();
        const fetchSavedPlaces = async () => {
            if (!user) return;
            try {
                const response = await api.get('/api/saved-places');
                setSavedBusinesses(response.data);
                const ids = new Set<number>(response.data.map((sp: any) => sp.business_id));
                setSavedIds(ids);
            } catch (err) {
                console.log('Error fetching saved places:', err);
            }
        };
        fetchSavedPlaces();
    }, [activeTab, user]);

    const handleUnsave = async (businessId: number) => {
        try {
            await api.delete(`/api/saved-places/${businessId}`);
            setSavedBusinesses(prev => prev.filter(sp => sp.business.id !== businessId));
            setSavedIds(prev => {
                const next = new Set(prev);
                next.delete(businessId);
                return next;
            });
        } catch (err) {
            console.log('Error unsaving business:', err);
        }
    };

    const handleDeleteBusiness = async (deleteId:number) => {
        try {
            await api.delete(`/api/businesses/${deleteId}`);
            setBusiness(prev =>
                prev.filter(biz => biz.id !== deleteId)
            );
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className={'bg-charcoal text-white'}>
            <div className={'p-8'}>
                <div className={'relative bg-no-repeat bg-cover bg-center w-full h-[250px] rounded-3xl mb-18'}
                     style={{backgroundImage: 'url(/images/ProfileBackground.png)'}}>
                    <div className={'absolute bottom-4 left-4'}>
                        <h1 className={'text-4xl font-bold mb-1'}>{user ? user.name : 'Loading'}</h1>
                        <p className={'flex items-center gap-2 text-secondary-dark font-medium'}>
                            <span className="material-symbols-outlined">verified</span>
                            Local Explorer - {user ? user.parish : "Loading"}, {user ? user.country : "Loading"}
                        </p>
                    </div>
                    <div className={'absolute -bottom-14 right-10 size-[120px] bg-cover bg-center bg-no-repeat rounded-full border-[3px] border-green-600 shadow-2xl'}
                         style={{backgroundImage: 'url(/images/ProfilePic.png)'}}>
                    </div>
                </div>
                <div className={'grid grid-cols-4 gap-10'}>
                    <div className={'col-span-1 space-y-8'}>
                        <div className={'bg-white/5 p-6 rounded-[2rem] border border-secondary-dark/5'}>
                            <div className={'text-secondary-dark text-lg font-bold mb-4 flex items-center gap-2'}>
                                <span className="material-symbols-outlined">analytics</span>
                                <h1>Your Impact</h1>
                            </div>
                            <div className={'space-y-4'}>
                                <div className={'flex flex-col p-3 gap-1 rounded-[2rem] border border-secondary-dark/10 bg-background-dark'}>
                                    <span className={'text-secondary-dark font-bold text-2xl'}>{savedBusinesses.length}</span>
                                    <span className={'text-xs uppercase tracking-wider opacity-70'}>Saved Places</span>
                                </div>
                                {/*<div className={'flex flex-col p-3 gap-1 rounded-[2rem] border border-secondary-dark/10 bg-background-dark'}>*/}
                                {/*    <span className={'text-secondary-dark font-bold text-2xl'}>18</span>*/}
                                {/*    <span className={'text-xs uppercase tracking-wider opacity-70'}>Reviews Written</span>*/}
                                {/*</div>*/}
                                <div className={'flex flex-col p-3 gap-1 rounded-[2rem] border border-secondary-dark/10 bg-background-dark'}>
                                    <span className={'text-secondary-dark font-bold text-2xl'}>{business.length}</span>
                                    <span className={'text-xs uppercase tracking-wider opacity-70'}>Businesses Added</span>
                                </div>
                            </div>
                        </div>
                        <div className={'bg-white/5 space-y-4 p-6 rounded-[2rem] border border-secondary-dark/5'}>
                            <h1 className={'mb-4 text-lg font-bold'}>Settings</h1>
                            <Link href={'/userProfile/edit'}  className={'flex item-center gap-3 p-2'}>
                                <span className="material-symbols-outlined">person</span>
                                <span className={'text-sm'}>Edit Profile</span>
                            </Link>
                            <div className={'flex item-center gap-3 p-2'}>
                                <span className="material-symbols-outlined">notifications</span>
                                <span className={'text-sm'}>Notifications</span>
                            </div>
                            <div onClick={logout} className={'flex item-center gap-3 p-2 text-red-400 hover:text-red-400/80 cursor-pointer'}>
                                <span className="material-symbols-outlined">logout</span>
                                <span className={'text-sm'}>Sign Out</span>
                            </div>
                        </div>
                    </div>
                    <div className={'col-span-3'}>
                        <div className={'flex border-b border-secondary-dark/10 mb-8'}>
                            <button onClick={() => setActiveTab('business')}
                                    className={`text-sm px-6 py-4 ${activeTab ==='business' ? 'text-secondary-dark font-bold border-b-2 border-secondary-dark ' : 'text-slate-400 font-medium'} flex items-center gap-3 cursor-pointer`}>
                                <span className="material-symbols-outlined">storefront</span>
                                <span>My Businesses</span>
                            </button>
                            <button onClick={() => setActiveTab('Saved')}
                                    className={`text-sm px-6 py-4 ${activeTab ==='Saved' ? 'text-secondary-dark font-bold border-b-2 border-secondary-dark ' : 'text-slate-400 font-medium'} flex items-center gap-3 cursor-pointer`}>
                                <span className="material-symbols-outlined">bookmark</span>
                                <span>Saved Places</span>
                            </button>
                            {/*<button onClick={() => setActiveTab('reviews')}*/}
                            {/*        className={`text-sm px-6 py-4 ${activeTab ==='reviews' ? 'text-secondary-dark font-bold border-b-2 border-secondary-dark ' : 'text-slate-400 font-medium'}  flex items-center gap-3 cursor-pointer`}>*/}
                            {/*    <span className="material-symbols-outlined">star</span>*/}
                            {/*    <span>My Reviews</span>*/}
                            {/*</button>*/}
                        </div>
                        <div>
                            {activeTab === 'Saved' &&(
                                <div className={'flex flex-col gap-4'}>
                                    <div className={'grid grid-cols-3 gap-8'}>
                                        {savedBusinesses.map((sp) => {
                                            const biz = sp.business;
                                            if (!biz) return null;

                                            return (
                                                <div key={sp.id} className={'relative rounded-[2rem] flex flex-col bg-white/5'}>
                                                    <img src={`https://pub-b83351aa0dd34354a7dc8614f98ab703.r2.dev/${biz.images[0].path}`} alt={'Restaurant'} className={'rounded-t-[2rem] w-full object-cover h-[250px]'} />
                                                    <div className={'flex flex-col px-4 py-3'}>
                                                        <h1 className={'flex items-center justify-between font-bold text-lg mb-2'}>
                                                            {biz.businessName}
                                                            <span onClick={() => handleUnsave(biz.id)} className="material-symbols-outlined text-secondary-dark">bookmark</span>
                                                        </h1>
                                                        <p className={'flex items-center gap-1 mb-4'}>
                                                            <span className="material-symbols-outlined text-secondary-dark" style={{fontSize: '14px'}}>star</span>
                                                            <span className={'text-secondary-dark text-sm font-bold'}>{biz.rating}</span>
                                                            <span className={'text-slate-500 text-xs ml-1'}>({biz.reviewCount} reviews)</span>
                                                        </p>
                                                        <p className={'text-slate-400 text-sm mb-4 line-clamp-2'}>
                                                            {biz.description}
                                                            {/*World-class dining on the cliffs of Negril with Authentic Jamaican flavours.*/}
                                                        </p>
                                                        <div className={'flex items-center gap-1 text-slate-500 text-xs'}>
                                                            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>location_on</span>
                                                            <span>{biz.city}, Jamaica</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {/*<div className={'relative rounded-[2rem] flex flex-col bg-white/5'}>*/}
                                        {/*    <img src={'/images/restaurant.png'} alt={'Restaurant'} className={'rounded-t-[2rem] w-full object-cover h-[250px]'} />*/}
                                        {/*    <div className={'flex flex-col px-4 py-3'}>*/}
                                        {/*        <h1 className={'flex items-center justify-between font-bold text-lg mb-2'}>*/}
                                        {/*            Rockhouse Restaurant*/}
                                        {/*            <span className="material-symbols-outlined text-secondary-dark">bookmark</span>*/}
                                        {/*        </h1>*/}
                                        {/*        <p className={'flex items-center gap-1 mb-4'}>*/}
                                        {/*            <span className="material-symbols-outlined text-secondary-dark" style={{fontSize: '14px'}}>star</span>*/}
                                        {/*            <span className={'text-secondary-dark text-sm font-bold'}>4.8</span>*/}
                                        {/*            <span className={'text-slate-500 text-xs ml-1'}>(120 reviews)</span>*/}
                                        {/*        </p>*/}
                                        {/*        <p className={'text-slate-400 text-sm mb-4 line-clamp-2'}>*/}
                                        {/*            World-class dining on the cliffs of Negril with Authentic Jamaican flavours.*/}
                                        {/*        </p>*/}
                                        {/*        <div className={'flex items-center gap-1 text-slate-500 text-xs'}>*/}
                                        {/*            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>location_on</span>*/}
                                        {/*            <span>Negril, Jamaica</span>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        {/*<div className={'relative rounded-[2rem] flex flex-col bg-white/5'}>*/}
                                        {/*    <img src={'/images/restaurant.png'} alt={'Restaurant'} className={'rounded-t-[2rem] w-full object-cover h-[250px]'} />*/}
                                        {/*    <div className={'flex flex-col px-4 py-3'}>*/}
                                        {/*        <h1 className={'flex items-center justify-between font-bold text-lg mb-2'}>*/}
                                        {/*            Rockhouse Restaurant*/}
                                        {/*            <span className="material-symbols-outlined text-secondary-dark">bookmark</span>*/}
                                        {/*        </h1>*/}
                                        {/*        <p className={'flex items-center gap-1 mb-4'}>*/}
                                        {/*            <span className="material-symbols-outlined text-secondary-dark" style={{fontSize: '14px'}}>star</span>*/}
                                        {/*            <span className={'text-secondary-dark text-sm font-bold'}>4.8</span>*/}
                                        {/*            <span className={'text-slate-500 text-xs ml-1'}>(120 reviews)</span>*/}
                                        {/*        </p>*/}
                                        {/*        <p className={'text-slate-400 text-sm mb-4 line-clamp-2'}>*/}
                                        {/*            World-class dining on the cliffs of Negril with Authentic Jamaican flavours.*/}
                                        {/*        </p>*/}
                                        {/*        <div className={'flex items-center gap-1 text-slate-500 text-xs'}>*/}
                                        {/*            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>location_on</span>*/}
                                        {/*            <span>Negril, Jamaica</span>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className={'w-full flex gap-3 items-center justify-center'}>
                                        <div className={'rounded-full px-5 py-3 bg-slate-600'}>
                                            1
                                        </div>
                                        <div className={'rounded-full px-5 py-3 bg-slate-600'}>
                                            2
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'reviews' &&(
                                <div className={'text-white'}>
                                    <h1>Reviews</h1>
                                </div>
                            )}
                            {activeTab === 'business' && (
                                <div className={'flex flex-col gap-4'}>
                                    <div className={'flex justify-between items-center mb-4'}>
                                        <p className={'text-slate-400 text-sm'}>{business.length} business{business.length !== 1 ? 'es' : ''} listed</p>
                                        <Link href={'/AddBusiness'}
                                              className={'bg-secondary-dark text-black text-sm font-bold px-4 py-2 rounded-full hover:brightness-110'}>
                                            + Add Business
                                        </Link>
                                    </div>
                                    {loadingBusinesses ? (
                                        <p className={'text-slate-400'}>Loading...</p>
                                    ) : business.length === 0 ? (
                                        <div className={'flex flex-col items-center justify-center py-20 gap-4'}>
                                            <span className="material-symbols-outlined text-slate-600 text-5xl">storefront</span>
                                            <p className={'text-slate-400'}>You haven't listed any businesses yet.</p>
                                            <Link href={'/AddBusiness'}
                                                  className={'bg-secondary-dark text-black text-sm font-bold px-6 py-3 rounded-full hover:brightness-110'}>
                                                List Your First Business
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className={'grid grid-cols-2 gap-6'}>
                                            {business.map((biz) => (
                                                <div key={biz.id} className={'rounded-[2rem] flex flex-col bg-white/5 p-5 gap-3'}>
                                                    <div className={'flex items-start justify-between'}>
                                                        <h1 className={'font-bold text-lg'}>{biz.businessName}</h1>
                                                        <span className={'text-xs bg-primary-dark/20 text-primary-dark px-2 py-1 rounded-full font-bold'}>{biz.category}</span>
                                                    </div>
                                                    <p className={'text-slate-400 text-sm line-clamp-2'}>{biz.description}</p>
                                                    <div className={'flex items-center gap-1 text-slate-500 text-xs'}>
                                                        <span className="material-symbols-outlined" style={{fontSize: '14px'}}>location_on</span>
                                                        <span>{biz.city}, {biz.parish}</span>
                                                    </div>
                                                    <div className={'flex items-center justify-between mt-2'}>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                            biz.status === 'approved' ? 'bg-green-500/20 text-green-400'
                                                                : biz.status === 'rejected' ? 'bg-red-500/20 text-red-400'
                                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                            {biz.status === 'approved' ? 'Approved'
                                                                : biz.status === 'rejected' ? 'Rejected'
                                                                    : 'Pending Review'}</span>
                                                        <div className={'flex items-center gap-3'}>
                                                            <Link href={`/business/${biz.slug}/edit`} className={'text-slate-400 text-xs font-bold hover:text-white'}>
                                                                Edit
                                                            </Link>
                                                            <button onClick={() => handleDeleteBusiness(biz.id)} className={'text-slate-400 text-xs font-bold hover:text-white'}>
                                                                Delete
                                                            </button>
                                                            <Link href={`/business/${biz.slug}`} className={'text-secondary-dark text-xs font-bold hover:underline'}>
                                                                View →
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    {biz.status === 'rejected' && biz.rejection_reason && (
                                                        <p className={'text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2'}>
                                                            <span className={'font-bold'}>Reason:</span> {biz.rejection_reason}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}