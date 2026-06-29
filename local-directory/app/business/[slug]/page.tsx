'use client'
import {FILTER_BUSINESSES} from "@/app/MockData";
import {MdOutlineVerified, MdSchedule, MdOutlineLocalPhone, MdPublic, MdMarkEmailUnread  } from "react-icons/md";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosCamera } from "react-icons/io";
import {CiLocationOn} from "react-icons/ci";
import StarRating from "@/app/StarRating";
import {api} from "@/app/context/ContextAuth";
import {useEffect, useState} from "react";
import {Business} from "@/app/Business";
import {Review} from "@/app/Review";

// const api = axios.create({
//     baseURL: 'https://web-production-0fb7e.up.railway.app',
//     withCredentials: true,
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'Accept': 'application/json',
//     }
// });
// api.interceptors.request.use(async (config) => {
//     // Only fetch CSRF cookie for non-GET requests
//     if (config.method !== 'get') {
//         await api.get('/sanctum/csrf-cookie');
//     }
//
//     const token = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('XSRF-TOKEN='))
//         ?.split('=')[1];
//
//     if (token) {
//         config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
//     }
//     return config;
// });
export default  function BusinessPage({params}:{params: Promise<{slug: string}>}){
    const [business, setBusiness] = useState<Business>();
    const [openWriteReview, setOpenWriteReview] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewForm, setReviewForm]   = useState({ rating: 0, body: '' });
    const [submitting, setSubmitting] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentUser, setCurrentUser] = useState<{id: number, name: string} | null>(null);


    // const business = FILTER_BUSINESSES.find(
    //     b => b.slug === slug
    // )

    useEffect(() => {
        const getBusiness = async () => {
            try {
                const {slug} = await params;

                const userRes = await api.get('api/user');
                setCurrentUser(userRes.data);
                console.log(userRes.data);

                const response = await api.get(`api/businesses/${slug}`);
                console.log(response.data);
                setBusiness(response.data);
                console.log("Business object:", response.data);
                console.log("Images:", response.data.images);
                console.log("First image:", response.data.images?.[0]);

                const reviewsRes = await api.get(`api/businesses/${slug}/reviews`);
                setReviews(reviewsRes.data);
                console.log(reviewsRes.data);
            } catch (err){
                console.log(err);
            }
        }
        getBusiness();
    }, [params]);

    const formatTo12Hour = (timeString: string | null) => {
        if (!timeString) return '';

        // Split the "HH:MM:SS" string
        const [hours, minutes] = timeString.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';

        hour = hour % 12;
        hour = hour ? hour : 12;
        const strHour = hour < 10 ? '0' + hour : hour;

        return `${strHour}:${minutes} ${ampm}`;
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (reviewForm.rating === 0 ){
            return;
        }
        setSubmitting(true);
        try {
            const {slug} = await params;

            // await api.get('/sanctum/csrf-cookie');
            const response = await api.post(`api/businesses/${slug}/reviews`, reviewForm);
            setReviews(prev => [response.data.review, ...prev.filter(r => r.user_id !== response.data.review.user_id)]);
            setOpenWriteReview(false);
            setReviewForm({ rating: 0, body: '' });
        } catch (err) {
            console.log('Error submitting review', err);
        } finally {
            setSubmitting(false);
        }
    }

    const handleDeleteReview = async (reviewId: number) => {
        try {
            const { slug } = await params;
            await api.delete(`api/businesses/${slug}/reviews/${reviewId}`);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={'bg-charcoal h-full text-white max-w-full mx-auto gap-8 p-6'}>
            <div className={'max-w-7xl mx-auto px-6 py-8'}></div>
            <div className={'relative w-full h-[500px] rounded-xl overflow-hidden mb-12'}>
                <div className={'absolute inset-0 bg-cover bg-center'} style={{backgroundImage: `url(https://pub-b83351aa0dd34354a7dc8614f98ab703.r2.dev/${business?.images?.[0]?.path})`}}></div>
                <div className={'absolute bottom-10 left-10 right-10 flex flex-col items-start gap-2'}>
                    <div className={'flex items-center gap-2 px-3 py-1 bg-secondary-dark text-background-dark rounded-full text-[10px] font-black uppercase tracking-widest'}>
                        <MdOutlineVerified /> Featured Destination
                    </div>
                    <h1 className={'text-white text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]'}>{business?.businessName}</h1>
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
                            {business?.images.map((pics, index) => (
                                <div key={index} className={'aspect-square rounded-lg overflow-hidden emerald-frame group'}>
                                    <img src={`https://pub-b83351aa0dd34354a7dc8614f98ab703.r2.dev/${pics.path}`} alt={'Res'}
                                         className={'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'}/>
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
                            {currentUser && business && currentUser.id !== business.user_id && (
                                <button onClick={() => setOpenWriteReview(prev => !prev)}
                                        className={'text-secondary-dark text-xs font-bold uppercase border-b border-secondary-dark/30 hover:border-secondary-dark'}>
                                    {openWriteReview ? 'Cancel' : 'Write a review'}
                                </button>
                            )}
                        </div>
                        {openWriteReview &&(
                            <div>
                                <form onSubmit={handleSubmitReview} className={'p-3 floating-jewel rounded-xl'}>
                                    <div className={'flex gap-4'}>
                                        <img src={`https://pub-b83351aa0dd34354a7dc8614f98ab703.r2.dev/${business?.images[0].path}`} alt={'Hero'}
                                             className={'w-10 h-10'}/>
                                        <p>{business?.businessName}</p>
                                    </div>
                                    <div className={'flex flex-col gap-3 items-center justify-center'}>
                                        <label>How was your experience?</label>
                                        <div>
                                            {[1,2,3,4,5].map(star => (
                                                <button key={star}
                                                        type={'button'}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => setReviewForm(prev => ({...prev, rating: star}))}>
                                                    <FaStar className={`text-2xl transition-colors ${star <= (hoverRating || reviewForm.rating) ? 'text-secondary-dark' : 'text-white/20'}`}/>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Your Thoughts</label>
                                        <textarea value={reviewForm.body}
                                                  // name={'body'}
                                                  onChange={e => setReviewForm(prev => ({...prev, body: e.target.value}))}
                                                  className={'w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-secondary-dark/50'}
                                                  placeholder={'Tell others about your experience...'} />
                                    </div>
                                    <button type={'submit'} disabled={submitting}
                                            className={'self-end bg-secondary-dark text-background-dark font-black uppercase tracking-widest disabled:opacity-50'}>
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        )}
                        <div className={'grid gap-6'}>
                            {reviews.length === 0 &&(
                                <p className={'text-white/40 italic text-sm'}>No reviews yet. Be the first!</p>
                            )}
                            {reviews.map(review => (
                                <div key={review.id} className={'floating-jewel p-6 rounded-xl'}>
                                    <div className={'flex justify-between items-start mb-4'}>
                                        <div className={'flex items-center gap-3'}>
                                            <div className={'size-10 rounded-full bg-secondary-dark/20 flex items-center justify-center text-secondary-dark font-bold'}>
                                                {review.user.firstName.slice(0,1).toUpperCase()}
                                                {review.user.lastName.slice(0,1).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className={'font-bold'}>{review.user.firstName ?? 'Anonymous'}</h4>
                                                <p className={'text-xs text-white/40 italic'}>
                                                    Visited {new Date(review.created_at).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                                            </div>
                                        </div>
                                        <div className={'flex text-secondary-dark'}>
                                            <StarRating rating={review.rating}/>
                                            {currentUser?.id === review.user_id && (
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className={'text-white/20 hover:text-red-400 transition-colors'}>
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className={'text-white/70 leading-relaxed italic'}>
                                        "{review.body}"
                                        {/*"The curried lobster was transformative. Eating with the sound of the waves just a few feet away is an experience I will never forget. Truly the heart of Port Antonio."*/}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <div className={'lg:col-span-4'}>
                    <div className={'sticky-sidebar space-y-6'}>
                        <div className={'floating-jewel p-8 rounded-xl flex flex-col gap-6'}>
                            {business?.website &&(
                                <a href={business?.website} className={' text-center w-full bg-secondary-dark hover:bg-secondary-dark/90 text-background-dark py-4 rounded-lg font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,191,0,0.3)] transition-all hover:-translate-y-1'}>
                                    Visit Website
                                </a>
                            )}
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex items-start gap-4"}>
                                    <CiLocationOn className={'text-secondary-dark text-md'}/>
                                    <div>
                                        <p className={'text-xs text-white/40 uppercase font-black tracking-widest mb-1'}>Location</p>
                                        <p className={'text-sm font-medium'}>{business?.streetAddress}, {business?.city}, {business?.parish}</p>
                                    </div>
                                </div>
                                <div className={"flex items-start gap-4"}>
                                    <MdSchedule className={'text-secondary-dark text-md'}/>
                                    <div>
                                        <p className={'text-xs text-white/40 uppercase font-black tracking-widest mb-1'}>Hours</p>
                                        {business?.hours?.map(hour => (
                                            <div key={hour.id} className={'flex justify-between gap-4 text-sm'}>
                                                <span className={'capitalize text-white/40 font-semibold'}>{hour.day}</span>
                                                {hour.is_closed
                                                    ? <span className={'text-red-400'}>Closed</span>
                                                    : <span>{formatTo12Hour(hour.open_time)} – {formatTo12Hour(hour.close_time)}</span>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={"flex items-start gap-4"}>
                                    <MdOutlineLocalPhone className={'text-secondary-dark text-md'}/>
                                    <div>
                                        <p className={'text-xs text-white/40 uppercase font-black tracking-widest mb-1'}>Contact</p>
                                        <p className={'text-sm font-medium'}>{business?.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={'pt-4 border-t border-white/5 flex justify-center gap-6'}>
                                {business?.socialLinks && business.socialLinks.map(link => (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                                        {link.platform === 'instagram' && <MdPublic/>}
                                        {link.platform === 'facebook' && <IoIosCamera/>}
                                        {link.platform === 'twitter' && <MdMarkEmailUnread/>}
                                    </a>
                                ))}
                            </div>
                        </div>
                    {/*    AMENITIES*/}
                    {/*    <div className={'p-6'}>*/}
                    {/*        <h4 className={'text-xs font-black uppercase tracking-[0.2em] mb-4 text-white/40"'}>Amenities</h4>*/}
                    {/*        <div className={'flex flex-wrap gap-2'}>*/}
                    {/*            <span className={'px-3 py-1 bg-white/5 rounded-full text-md font-bold border border-white/10'}>Parking</span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}