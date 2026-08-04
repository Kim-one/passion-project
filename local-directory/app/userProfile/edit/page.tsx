'use client'
import {useAuth, api} from "@/app/context/ContextAuth";
import {useState, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import { SlCamera } from "react-icons/sl";

const IMAGE_BASE = 'https://pub-b83351aa0dd34354a7dc8614f98ab703.r2.dev/';

const PARISHES = [
    'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon', 'Manchester',
    'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James', 'Trelawny',
    'St. Ann', 'St. Mary', 'Portland', 'St. Thomas',
];

const COUNTRIES = ['Jamaica', 'Canada'];

const EditProfile = () => {
    const {user, setUser} = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        parish: '',
        country: '',
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [removeAvatar, setRemoveAvatar] = useState(false);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Not logged in → send to login
    useEffect(() => {
        if (user === null) router.replace('/login');
    }, [user, router]);

    // Prefill from the current user
    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                email: user.email ?? '',
                parish: user.parish ?? '',
                country: user.country ?? '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be 2MB or smaller.');
            return;
        }
        setError('');
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setRemoveAvatar(false);
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview('');
        setRemoveAvatar(true);
    };

    // What to actually show in the avatar circle
    const displayedAvatar = avatarPreview
        ? avatarPreview
        : (!removeAvatar && user?.avatar)
            ? `${IMAGE_BASE}${user.avatar}`
            : '/images/ProfilePic.png';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const fd = new FormData();
            fd.append('_method', 'PUT'); // method spoofing so PHP parses the upload
            fd.append('firstName', form.firstName);
            fd.append('lastName', form.lastName);
            fd.append('email', form.email);
            fd.append('parish', form.parish);
            fd.append('country', form.country);
            if (avatarFile) fd.append('avatar', avatarFile);
            if (removeAvatar) fd.append('removeAvatar', '1');

            const res = await api.post('/api/user', fd, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            const u = res.data;
            setUser({
                name: u.name,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                parish: u.parish,
                country: u.country,
                avatar: u.avatar,
                is_admin: !!u.is_admin,
            });

            // Reset local upload state now that it's persisted
            setAvatarFile(null);
            setAvatarPreview('');
            setRemoveAvatar(false);
            setMessage('Profile updated successfully.');
        } catch (err: any) {
            console.log('Error updating profile:', err);
            setError(err.response?.data?.message ?? 'Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = 'rounded-full px-5 py-3 bg-surface-darker border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-secondary-dark';

    return (
        <form onSubmit={handleSubmit} className={'flex flex-col bg-charcoal min-h-screen text-white max-w-full gap-8 p-6'}>
            <div className={'flex flex-col gap-2 mb-4'}>
                <div className={'border-t-2 border-t-secondary-dark w-12'}></div>
                <h1 className={'text-3xl font-black tracking-tight'}>Edit Profile</h1>
                <p className={'text-slate-400'}>Manage your public presence and account preferences across the Jewel of the Caribbean.</p>
            </div>

            {/* PROFILE IMAGE */}
            <section className={'space-y-6'}>
                <div className={'flex gap-1 items-center'}>
                    <div className={'bg-primary-dark w-6 h-[1px]'}></div>
                    <span className={'text-xs text-primary-dark uppercase tracking-widest font-bold'}>Profile Picture</span>
                </div>
                <div className={'bg-white/5 border border-white/5 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8'}>
                    <div className={'relative group'}>
                        <div className={'w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 border-secondary-dark rounded-full shadow-2xl'}>
                            <img src={displayedAvatar} alt={'Profile Picture'} className={'object-cover w-full h-full'} />
                        </div>
                        <div onClick={() => fileInputRef.current?.click()}
                             className={'absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity'}>
                            <SlCamera className={'text-white text-2xl'}/>
                        </div>
                    </div>
                    <input ref={fileInputRef} type={'file'} accept={'image/png,image/jpeg,image/webp,image/gif'}
                           onChange={handleAvatarChange} className={'hidden'} />
                    <div className={'text-center md:text-left'}>
                        <h4 className={'font-bold text-lg mb-2'}>Your Avatar</h4>
                        <p className={'text-sm text-slate-400 mb-6 max-w-xs'}>JPG, GIF or PNG. Max size of
                            2MB. A high-quality photo helps others recognize you in the community.</p>
                        <div className={'flex flex-wrap justify-center md:justify-start gap-4'}>
                            <button type={'button'} onClick={() => fileInputRef.current?.click()}
                                    className={'px-6 py-2 bg-secondary-dark rounded-full font-bold text-background-darker hover:scale-105 transition-transform active:scale-95'}>
                                Upload New
                            </button>
                            <button type={'button'} onClick={handleRemoveAvatar}
                                    className={'px-6 py-2 rounded-full border border-white/15 text-slate-300 font-bold hover:bg-white/5 transition-colors'}>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* PUBLIC PROFILE */}
            <section className={'space-y-6'}>
                <div className={'flex gap-1 items-center'}>
                    <div className={'bg-primary-dark w-6 h-[1px]'}></div>
                    <span className={'text-xs text-primary-dark uppercase tracking-widest font-bold'}>Public Profile</span>
                </div>
                <div className={'bg-white/5 border border-white/5 p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6'}>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'text-sm font-medium'}>First Name</label>
                        <input name={'firstName'} value={form.firstName} onChange={handleChange}
                               placeholder={'First name'} className={inputClass}/>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'text-sm font-medium'}>Last Name</label>
                        <input name={'lastName'} value={form.lastName} onChange={handleChange}
                               placeholder={'Last name'} className={inputClass}/>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'text-sm font-medium'}>Email</label>
                        <input type={'email'} name={'email'} value={form.email} onChange={handleChange}
                               placeholder={'name@example.com'} className={inputClass}/>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'text-sm font-medium'}>Parish</label>
                        <select name={'parish'} value={form.parish} onChange={handleChange}
                                className={`${inputClass} bg-transparent`}>
                            <option value={''} disabled className={'text-black'}>Choose a parish</option>
                            {PARISHES.map(p => <option key={p} value={p} className={'text-black'}>{p}</option>)}
                        </select>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label className={'text-sm font-medium'}>Country</label>
                        <select name={'country'} value={form.country} onChange={handleChange}
                                className={`${inputClass} bg-transparent`}>
                            <option value={''} disabled className={'text-black'}>Choose a country</option>
                            {COUNTRIES.map(c => <option key={c} value={c} className={'text-black'}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {/* ACTIONS */}
            <div className={'flex items-center gap-4'}>
                <button type={'submit'} disabled={saving}
                        className={'px-8 py-3 bg-secondary-dark rounded-full font-black uppercase tracking-widest text-sm text-background-darker hover:brightness-110 transition-all disabled:opacity-50'}>
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {message && <span className={'text-emerald-400 text-sm font-semibold'}>{message}</span>}
                {error && <span className={'text-red-400 text-sm font-semibold'}>{error}</span>}
            </div>
        </form>
    );
};

export default EditProfile;
