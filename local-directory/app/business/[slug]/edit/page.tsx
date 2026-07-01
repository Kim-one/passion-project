'use client'
import React, {useEffect, useRef, useState} from "react";
import {Business} from "@/app/Business";
import {api} from "@/app/context/ContextAuth";
import {GrInstagram} from "react-icons/gr";
import {FaFacebookF} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import {BusinessImage} from "@/app/BusinessImage";
import {BusinessSocialLinks} from "@/app/BusinessSocialLinks";
import {BusinessHours} from "@/app/BusinessHours";
import {useRouter} from "next/navigation";

// const api = axios.create({
//     baseURL: 'http://localhost:8000',
//     withCredentials: true,
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'Accept': 'application/json',
//     }
// });

const CATEGORIES = [
    'Restaurant',
    'Cafe',
    'Bar & Nightlife',
    'Hotel & Lodging',
    'Tour & Attraction',
    'Retail & Shopping',
    'Beauty & Spa',
    'Health & Wellness',
    'Automotive',
    'Professional Services',
    'Real Estate',
    'Other',
];

const PARISHES = [
    'Kingston',
    'St. Andrew',
    'St. Catherine',
    'Clarendon',
    'Manchester',
    'St. Elizabeth',
    'Westmoreland',
    'Hanover',
    'St. James',
    'Trelawny',
    'St. Ann',
    'St. Mary',
    'Portland',
    'St. Thomas',
];

const Edit =  ({params}:{params: Promise<{slug: string}>}) => {
    const router = useRouter();
    const [business, setBusiness] = useState<Business>();

    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        slogan: '',
        description: '',
        streetAddress: '',
        parish: '',
        city: '',
        website: '',
        phone: '',
        email: '',
        about: '',
    });
    const [socialLink, setSocialLink] = useState({
        instagram: '',
        twitter: '',
        facebook: '',
    });

    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState<string>('');
    const [gallery , setGallery] = useState<File[]>([]);
    const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
    const [existingGallery, setExistingGallery] = useState<BusinessImage[]>([]);

    const heroInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

    const [hours, setHours] = useState(
        DAYS.map(day => ({
            day,
            open_time: '09:00',
            close_time: '17:00',
            is_closed: false,
        }))
    );

    const handleHoursChange = (index: number, field: string, value: string | boolean) => {
        setHours(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
    };

    useEffect(() => {
        const editBusiness = async () => {
            try {
                const {slug} = await params;
                const response = await api.get(`api/businesses/${slug}`);
                const b = response.data;
                setBusiness(b);

                console.log(b)
                setFormData({
                    businessName: b.businessName ?? '',
                    category: b.category ?? '',
                    slogan: b.slogan ?? '',
                    description: b.description ?? '',
                    streetAddress: b.streetAddress ?? '',
                    parish: b.parish ?? '',
                    city: b.city ?? '',
                    website: b.website ?? '',
                    phone: b.phone ?? '',
                    email: b.email ?? '',
                    about: b.about ?? '',
                });

                const links = { instagram: '', twitter: '', facebook: '' };
                (b.social_links ?? []).forEach((l: BusinessSocialLinks) => { links[l.platform] = l.url; });
                setSocialLink(links);

                if (b.hours?.length) {
                    setHours(DAYS.map(day => {
                        const match = b.hours.find((h: BusinessHours) => h.day === day);
                        return match ? {
                            day,
                            open_time: (match.open_time ?? '09:00').slice(0,5),
                            close_time: (match.close_time ?? '17:00').slice(0,5),
                            is_closed: !!match.is_closed,
                        } : { day, open_time: '09:00', close_time: '17:00', is_closed: false };
                    }));
                }

                const hero = b.images?.find((img: BusinessImage) => img.type === 'hero');
                if (hero) setHeroPreview(hero.url ?? hero.path);
                const galleryImages = b.images?.filter((img: BusinessImage) => img.type === 'gallery') ?? [];
                setExistingGallery(galleryImages);
                console.log(galleryImages)
            } catch (err) {
                console.log("Error fetching business:", err);
            }
        }
        editBusiness();
    }, [params]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSocialLinkChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSocialLink(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        setHeroFile(file)
        setHeroPreview(URL.createObjectURL(file));
    }

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const remaining = 8 - existingGallery.length - gallery.length;
        const toAdd = files.slice(0, remaining);
        setGallery(prev => [
            ...prev,
            ...toAdd
        ]);
        setGalleryPreview(prev => [
            ...prev,
            ...toAdd.map(f => URL.createObjectURL(f))
        ]);
    }

    const removeGalleryImage = (index: number) =>{
        setGallery(prev => prev.filter((_, i) => i !== index));
        setGalleryPreview(prev => prev.filter((_, i) => i !== index));
    }

    const removeExistingGalleryImage = async (imageId: number) => {
        try {
            await api.delete(`/api/businesses/image/${imageId}`);
            setExistingGallery(prev => prev.filter(img => img.id !== imageId));
        } catch (err) {
            console.log("Failed to delete image:", err);
        }
    };

    const handleEditBusiness = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        Object.entries(socialLink).forEach(([platform, url]) => {
            if (url) data.append(`socialLinks[${platform}]`, url);
        });

        if (heroFile) data.append('heroImage', heroFile);

        gallery.forEach(file => data.append('galleryImages[]', file));

        hours.forEach((hour, i) => {
            data.append(`hours[${i}][day]`, hour.day);
            data.append(`hours[${i}][open_time]`, hour.open_time);
            data.append(`hours[${i}][close_time]`, hour.close_time);
            data.append(`hours[${i}][is_closed]`, hour.is_closed ? '1' : '0');
        });

        try {
            const { slug } = await params;
            const response = await api.post(`/api/businesses/${slug}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(response.data);
            router.push('/userProfile');
        } catch (err) {
            console.log(err);
            // setError(err.response?.data?.message);
        }
    };

    return (
        <div suppressHydrationWarning className={'bg-charcoal h-screen flex flex-col items-center overflow-y-auto'}>
            <div className={'flex flex-col  items-center'}>
                {/*<div className={'flex flex-col mx-30 gap-2 py-10 px-80  text-center'}>*/}
                {/*    <h1 className={'text-primary-dark uppercase tracking-widest'}>Empowering Local Gems</h1>*/}
                {/*    <h1 className={'text-white text-5xl font-black tracking-tighter'}>List Your Business</h1>*/}
                {/*    <p className={'text-slate-300 text-center'}>Join our vibrant community of local creatures and entrepreneurs.*/}
                {/*        Showcase your venture to thousands of residents and visitors across the island.*/}
                {/*    </p>*/}
                {/*</div>*/}
                <form onSubmit={handleEditBusiness}
                      className={'flex flex-col bg-surface-form-light text-white gap-6 p-10 border border-surface-dark w-[800px] rounded-2xl'}>
                    <div className={'flex justify-between'}>
                        <div className={'flex flex-col gap-2 w-[350px]'}>
                            <label className={'uppercase font-semibold text-sm'}>Business Name</label>
                            <input type={'text'} name={'businessName'}
                                   value={formData.businessName}
                                   onChange={handleChange}
                                   placeholder={''} className={'border border-[#564f39] p-3 w-full rounded-3xl'}/>
                            {/*<p className={'text-red-500'}>{error}</p>*/}
                        </div>
                        <div className={'flex flex-col gap-2 w-[350px]'}>
                            <label className={'uppercase font-semibold text-sm'}>Category</label>
                            <select name={'category'}
                                    value={formData.category} onChange={handleChange}
                                    className={'border border-[#564f39] p-3 w-full rounded-3xl bg-transparent text-white'}>
                                <option value={''} disabled>Choose a Category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat} className={'text-black'}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'flex justify-between text-sm uppercase font-semibold text-sm'}>
                            <span>Slogan</span>
                            <span className={'text-xs lowercase'}>Give a catchy slogan</span>
                        </label>
                        <textarea name={'slogan'}
                                  value={formData.slogan} onChange={handleChange} rows={1}
                                  className={'border border-[#564f39] rounded-3xl w-full p-3 resize-none'}
                                  placeholder={'Catch Phrase'}></textarea>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'flex justify-between text-sm uppercase font-semibold text-sm'}>
                            <span>Description</span>
                            <span className={'text-xs lowercase'}>Give a short description</span>
                        </label>
                        <textarea name={'description'}
                                  value={formData.description} onChange={handleChange}
                                  className={'border border-[#564f39] rounded-3xl w-full p-3 resize-none h-[50px]'}
                                  placeholder={'What makes your place special?'}></textarea>
                        {/*<p className={'text-red-500'}>{error}</p>*/}
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'flex justify-between text-sm uppercase font-semibold text-sm'}>
                            THE STORY
                            <span className={'text-xs lowercase'}>Tell your unique tale</span>
                        </label>
                        <textarea name={'about'}
                                  value={formData.about} onChange={handleChange}
                                  className={'border border-[#564f39] rounded-3xl w-full p-3 resize-none h-[150px]'}
                                  placeholder={'Tell us the heart of your business story...What makes your place special?'}></textarea>
                    </div>
                    <div className={'flex flex-row gap-4'}>
                        <div className={'flex flex-col gap-2 w-[450px]'}>
                            <label className={'uppercase font-semibold text-sm'}>
                                Location Address
                            </label>
                            <input type={"text"} name={'streetAddress'}
                                   value={formData.streetAddress} onChange={handleChange}
                                   placeholder={'Street Address, building name'}
                                   className={'border border-[#564f39] p-3 w-full rounded-3xl'}
                            />
                            {/*<p className={'text-red-500'}>{error}</p>*/}
                        </div>
                        <div className={'flex flex-col gap-2 w-[200px]'}>
                            <label className={'uppercase font-semibold text-sm'}>City</label>
                            <input type={'text'} name={'city'}
                                   value={formData.city}
                                   onChange={handleChange}
                                   placeholder={'e.g. Kingston'}
                                   className={'border border-[#564f39] p-3 w-full rounded-3xl'}/>
                            {/*<p className={'text-red-500'}>{error}</p>*/}
                        </div>
                        <div className={'flex flex-col gap-2 w-[330px]'}>
                            <label className={'uppercase text-sm font-semibold'}>Parish</label>
                            <select name={'parish'}
                                    value={formData.parish} onChange={handleChange}
                                    className={'border border-[#564f39] p-3 w-full rounded-3xl bg-transparent text-white'}>
                                <option value={''} disabled>Choose a Parish</option>
                                {PARISHES.map(p => (
                                    <option key={p} value={p} className={'text-black'}>{p}</option>
                                ))}
                            </select>
                            {/*<p className={'text-red-500'}>{error}</p>*/}
                        </div>
                    </div>
                    <div className={'space-y-6'}>
                        <div className={'pt-4 border-t border-[#3a3527]'}>
                            <h3 className={'text-white text-lg font-bold mb-4'}>Contact Information</h3>
                        </div>
                        <div className={'grid grid-cols-1 md:grid-cols-3 gap-6'}>
                            <div className={'flex flex-col gap-2'}>
                                <label>Phone Number</label>
                                <input type={'text'} placeholder={'876555555'}
                                       onChange={handleChange}
                                       name={'phone'}
                                       value={formData.phone}
                                       className={'w-full rounded-xl text-white border border-[#564f39] bg-[#28241b] h-13 placeholder:[#bcb39a]/50 p-4'}/>
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                <label>Email Address</label>
                                <input type={'email'}
                                       name={'email'}
                                       value={formData.email}
                                       onChange={handleChange}
                                       placeholder={'hello@email.com'}
                                       className={'w-full rounded-xl text-white border border-[#564f39] bg-[#28241b] h-13 placeholder:[#bcb39a]/50 p-4'}/>
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                <label>Website</label>
                                <input type={'url'} placeholder={'www.hello.com'}
                                       onChange={handleChange}
                                       name={'website'}
                                       value={formData.website}
                                       className={'w-full rounded-xl text-white border border-[#564f39] bg-[#28241b] h-13 placeholder:[#bcb39a]/50 p-4'}/>
                            </div>
                        </div>
                        <div className={'flex flex-col gap-4'}>
                            <label>Social Media Links</label>
                            <div className={'grid grid-cols-1 md:grid-cols-3 gap-4'}>
                                <div className={'relative'}>
                                    <GrInstagram className={'absolute left-4 top-5 text-xl text-secondary-dark'}/>
                                    <input type={'text'}
                                           value={socialLink.instagram}
                                           onChange={handleSocialLinkChange}
                                           name={'instagram'}
                                           placeholder={'https://instagram.com/yourbusiness'}
                                           className={'w-full rounded-full text-white border border-[#564f39] bg-[#28241b] h-14 pr-4 pl-12 h-14 text-base'}/>
                                </div>
                                <div className={'relative'}>
                                    <FaFacebookF className={'absolute left-4 top-5 text-xl text-secondary-dark'}/>
                                    <input type={'text'}
                                           name={'facebook'}
                                           value={socialLink.facebook}
                                           onChange={handleSocialLinkChange}
                                           placeholder={'https://facebook.com/yourbusiness'}
                                           className={'w-full rounded-full text-white border border-[#564f39] bg-[#28241b] h-14 pr-4 pl-12 h-14 text-base'}/>
                                </div>
                                <div className={'relative'}>
                                    <FaXTwitter className={'absolute left-4 top-5 text-xl text-secondary-dark'}/>
                                    <input type={'text'}
                                           name={'twitter'}
                                           value={socialLink.twitter}
                                           onChange={handleSocialLinkChange}
                                           placeholder={'https://twitter.com/yourbusiness'}
                                           className={'w-full rounded-full text-white border border-[#564f39] bg-[#28241b] h-14 pr-4 pl-12 h-14 text-base'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-4 pb-12 border-b border-[#564f39]'}>
                        <label className={'uppercase font-semibold text-sm'}>Business Hours</label>
                        <div className={'flex flex-col gap-3'}>
                            {hours.map((hour, i) => (
                                <div key={hour.day} className={'flex items-center gap-4'}>
                                    <span className={'w-28 text-sm font-semibold capitalize text-slate-300'}>{hour.day}</span>
                                    {/* Closed toggle */}
                                    <label className={'flex items-center gap-2 cursor-pointer'}>
                                        <div onClick={() => handleHoursChange(i, 'is_closed', !hour.is_closed)}
                                             className={`relative w-10 h-5 rounded-full transition-colors ${hour.is_closed ? 'bg-red-500' : 'bg-secondary-dark'}`}>
                                            <div className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full transition-transform ${hour.is_closed ? 'translate-x-5' : 'translate-x-0'}`}/>
                                        </div>
                                        <span className={'text-xs text-slate-400'}>{hour.is_closed ? 'Closed' : 'Open'}</span>
                                    </label>

                                    {!hour.is_closed && (
                                        <div className={'flex items-center gap-2 flex-1'}>
                                            <input
                                                type={'time'}
                                                value={hour.open_time}
                                                onChange={e => handleHoursChange(i, 'open_time', e.target.value)}
                                                className={'border border-[#564f39] bg-transparent p-2 rounded-xl text-sm text-white'}/>
                                            <span className={'text-slate-500 text-sm'}>to</span>
                                            <input
                                                type={'time'}
                                                value={hour.close_time}
                                                onChange={e => handleHoursChange(i, 'close_time', e.target.value)}
                                                className={'border border-[#564f39] bg-transparent p-2 rounded-xl text-sm text-white'}/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label>
                            Hero Image
                        </label>
                        <div onClick={() =>
                            heroInputRef.current?.click()}
                             className={'relative flex items-center justify-center border-2 border-dashed h-[220px] rounded-3xl cursor-pointer overflow-hidden hover:border-secondary-dark transition'}>
                            {heroPreview ? (
                                <>
                                    <img src={heroPreview} alt={'Hero Preview'} className={'w-full h-full object-cover'}/>
                                    <div className={'absolute inset-0 bg-black/40 flex items-center justify-center'}>
                                        <p className={'text-white text-sm font-semibold'}>Click to replace</p>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <p>Click to upload hero image</p>
                                </div>
                            )}
                        </div>
                        <input ref={heroInputRef} type={'file'} accept={'image/*'} onChange={handleHeroChange} className={'hidden'} />
                        {/*<p className={'text-red-500'}>{error}</p>*/}
                    </div>
                    <div className={'flex flex-col gap-2 pb-12 border-b border-[#564f39]'}>
                        <label className={'uppercase text-sm font-semibold'}>Gallery Photos</label>
                        <div className={'grid grid-cols-4 gap-3'}>
                            {existingGallery.map((img) => (
                                <div key={img.id} className={'relative h-[100px] rounded-2xl overflow-hidden group'}>
                                    <img src={img.url ?? img.path} alt={'gallery'} className={'w-full h-full object-cover'}/>
                                    <button type={"button"}
                                            className={'absolute top-1 right-1 bg-red-500 rounded-full size-6 items-center justify-center hidden group-hover:flex'}
                                            onClick={() => removeExistingGalleryImage(img.id)}>x</button>
                                </div>
                            ))}
                            {galleryPreview.map((src, i) => (
                                <div key={i} className={'relative h-[100px] rounded-2xl overflow-hidden group'}>
                                    <img src={src} alt={`gallery ${i}`} className={'w-full h-full object-cover'}/>
                                    <button type={"button"} className={'absolute top-1 right-1 bg-red-500 rounded-full size-6 items-center justify-center hidden group-hover:flex'}
                                            onClick={() => removeGalleryImage(i)}>x</button>
                                </div>
                            ))}
                            {(existingGallery.length + gallery.length) < 8 && (
                                <div onClick={() => galleryInputRef.current?.click()}
                                     className={'flex flex-col items-center justify-center h-[100px] border-2 border-dashed border-[#564f39] rounded-2xl cursor-pointer text-slate-400'}>
                                    <p>Add Photos</p>
                                </div>
                            )}
                        </div>
                        <input ref={galleryInputRef} type={"file"} accept={'image/*'} multiple onChange={handleGalleryChange} className={'hidden'}/>
                    </div>
                    {/*<div className={'flex flex-col gap-2 mb-12'}>*/}
                    {/*    <p className={'uppercase text-sm font-semibold'}>Popular Tags</p>*/}
                    {/*    <div className={'flex flex-row gap-2'}>*/}
                    {/*        <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>*/}
                    {/*        <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>*/}
                    {/*        <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>*/}
                    {/*        <p className={'bg-[#3a3527] px-3 py-1 rounded-full text-xs font-medium text-white'}>#VeganFriendly</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className={'flex justify-between'}>
                        <div className={'flex items-center justify-center gap-2'}>
                            <button onClick={() => router.push('/userProfile')}
                                    className={'w-full flex items-center justify-center bg-gray-200 rounded-full text-black font-black text-lg h-14 cursor-pointer hover:scale-105'}>
                               Cancel
                            </button>
                            {/*<div className={'flex items-center justify-center rounded-full size-5 bg-primary-dark/50'}>*/}
                            {/*    <span className="material-symbols-outlined font-bold text-primary-dark" style={{fontSize:18}}>check</span>*/}
                            {/*</div>*/}
                            {/*<p>I agree to local business community guidelines</p>*/}
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