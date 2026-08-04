'use client'
import {useEffect, useState, useCallback} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {api, useAuth} from "@/app/context/ContextAuth";
import {Business} from "@/app/Business";
import {CiLocationOn} from "react-icons/ci";

const IMAGE_BASE = 'https://pub-b83351aa0dd34354a7dc8614f98ab703.r2.dev/';

type StatusTab = 'pending' | 'approved' | 'rejected' | 'all';

interface Stats {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
}

const TABS: { key: StatusTab; label: string }[] = [
    {key: 'pending', label: 'Pending'},
    {key: 'approved', label: 'Approved'},
    {key: 'rejected', label: 'Rejected'},
    {key: 'all', label: 'All'},
];

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20',
    approved: 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20',
    rejected: 'bg-red-400/10 text-red-300 border border-red-400/20',
};

const AdminDashboard = () => {
    const {user, loading} = useAuth();
    const router = useRouter();

    const [tab, setTab] = useState<StatusTab>('pending');
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [stats, setStats] = useState<Stats>({pending: 0, approved: 0, rejected: 0, total: 0});
    const [fetching, setFetching] = useState(true);
    const [actioningId, setActioningId] = useState<number | null>(null);

    // Reject modal state
    const [rejectTarget, setRejectTarget] = useState<Business | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // Guard: only admins may view this page.
    useEffect(() => {
        if (!loading && (!user || !user.is_admin)) {
            router.replace('/');
        }
    }, [loading, user, router]);

    const loadStats = useCallback(async () => {
        try {
            const res = await api.get('/api/admin/businesses/stats');
            setStats(res.data);
        } catch (err) {
            console.log('Error fetching stats:', err);
        }
    }, []);

    const loadBusinesses = useCallback(async (status: StatusTab) => {
        setFetching(true);
        try {
            const res = await api.get(`/api/admin/businesses?status=${status}`);
            setBusinesses(res.data);
        } catch (err) {
            console.log('Error fetching businesses:', err);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        if (user?.is_admin) {
            loadBusinesses(tab);
            loadStats();
        }
    }, [tab, user, loadBusinesses, loadStats]);

    const handleApprove = async (business: Business) => {
        setActioningId(business.id);
        try {
            await api.patch(`/api/admin/businesses/${business.id}/approve`);
            await Promise.all([loadBusinesses(tab), loadStats()]);
        } catch (err) {
            console.log('Error approving business:', err);
        } finally {
            setActioningId(null);
        }
    };

    const submitReject = async () => {
        if (!rejectTarget) return;
        setActioningId(rejectTarget.id);
        try {
            await api.patch(`/api/admin/businesses/${rejectTarget.id}/reject`, {
                rejection_reason: rejectReason.trim() || null,
            });
            setRejectTarget(null);
            setRejectReason('');
            await Promise.all([loadBusinesses(tab), loadStats()]);
        } catch (err) {
            console.log('Error rejecting business:', err);
        } finally {
            setActioningId(null);
        }
    };

    if (loading || !user || !user.is_admin) {
        return (
            <div className={'bg-charcoal min-h-screen flex items-center justify-center text-slate-400'}>
                Checking access…
            </div>
        );
    }

    return (
        <div className={'bg-charcoal min-h-screen text-white px-6 py-10'}>
            <div className={'max-w-6xl mx-auto'}>
                {/* Header */}
                <div className={'mb-8'}>
                    <p className={'text-xs font-black uppercase tracking-widest text-secondary-dark mb-2'}>Admin</p>
                    <h1 className={'text-4xl font-black tracking-tight mb-2'}>Business Review</h1>
                    <p className={'text-slate-500'}>Approve or reject business submissions before they go live on discovery.</p>
                </div>

                {/* Stat cards */}
                <div className={'grid grid-cols-2 md:grid-cols-4 gap-4 mb-10'}>
                    {([
                        {label: 'Pending', value: stats.pending, accent: 'text-yellow-300'},
                        {label: 'Approved', value: stats.approved, accent: 'text-emerald-300'},
                        {label: 'Rejected', value: stats.rejected, accent: 'text-red-300'},
                        {label: 'Total', value: stats.total, accent: 'text-white'},
                    ]).map((s) => (
                        <div key={s.label} className={'bg-surface-darker rounded-2xl border border-white/5 p-5'}>
                            <p className={'text-xs font-bold uppercase tracking-widest text-slate-500 mb-2'}>{s.label}</p>
                            <p className={`text-3xl font-black ${s.accent}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className={'flex flex-wrap gap-3 mb-8'}>
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                                tab === t.key
                                    ? 'bg-secondary-dark text-background-darker'
                                    : 'bg-surface-darker text-white hover:bg-slate-800'
                            }`}
                        >
                            {t.label}
                            {t.key === 'pending' && stats.pending > 0 && (
                                <span className={`ml-2 px-1.5 rounded-md text-xs ${tab === t.key ? 'bg-background-darker/20' : 'bg-yellow-400/20 text-yellow-300'}`}>
                                    {stats.pending}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* List */}
                {fetching ? (
                    <p className={'text-slate-500'}>Loading businesses…</p>
                ) : businesses.length === 0 ? (
                    <div className={'bg-surface-darker rounded-2xl border border-white/5 p-12 text-center text-slate-500'}>
                        No {tab === 'all' ? '' : tab} businesses to show.
                    </div>
                ) : (
                    <div className={'flex flex-col gap-5'}>
                        {businesses.map((biz) => (
                            <div key={biz.id} className={'bg-surface-darker rounded-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row'}>
                                {/* Image */}
                                <div
                                    className={'h-48 md:h-auto md:w-64 shrink-0 bg-cover bg-center bg-background-dark'}
                                    style={biz.images?.[0] ? {backgroundImage: `url(${IMAGE_BASE}${biz.images[0].path})`} : undefined}
                                />

                                {/* Body */}
                                <div className={'flex-1 p-6 flex flex-col'}>
                                    <div className={'flex items-start justify-between gap-4 mb-2'}>
                                        <div>
                                            <div className={'flex items-center gap-3 flex-wrap'}>
                                                <h3 className={'text-xl font-bold'}>{biz.businessName}</h3>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${STATUS_STYLES[biz.status] ?? ''}`}>
                                                    {biz.status}
                                                </span>
                                            </div>
                                            {biz.slogan && <p className={'text-sm text-slate-400 italic mt-1'}>&quot;{biz.slogan}&quot;</p>}
                                        </div>
                                        <span className={'bg-primary-dark/20 text-primary-dark text-[10px] font-black uppercase py-1 px-2 rounded-md shrink-0'}>
                                            {biz.category}
                                        </span>
                                    </div>

                                    <p className={'text-sm text-slate-400 mb-3 flex items-center gap-1'}>
                                        <CiLocationOn/> {biz.streetAddress}, {biz.city}, {biz.parish}
                                    </p>

                                    <p className={'text-sm text-slate-300 mb-4 line-clamp-3'}>{biz.description}</p>

                                    {/* Owner + contact */}
                                    <div className={'flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 mb-4'}>
                                        {/* @ts-ignore - user is eager-loaded by the admin endpoint */}
                                        {biz.user && <span>Owner: {biz.user.firstName} {biz.user.lastName} ({biz.user.email})</span>}
                                        {biz.phone && <span>Phone: {biz.phone}</span>}
                                        {biz.email && <span>Email: {biz.email}</span>}
                                        {biz.website && <span>Website: {biz.website}</span>}
                                    </div>

                                    {biz.status === 'rejected' && biz.rejection_reason && (
                                        <p className={'text-xs text-red-300 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-4'}>
                                            Rejection reason: {biz.rejection_reason}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className={'mt-auto flex flex-wrap items-center gap-3'}>
                                        {biz.status !== 'approved' && (
                                            <button
                                                disabled={actioningId === biz.id}
                                                onClick={() => handleApprove(biz)}
                                                className={'bg-emerald-500 hover:brightness-110 text-background-darker text-sm font-black uppercase tracking-wide px-5 py-2 rounded-xl transition-all disabled:opacity-50'}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {biz.status !== 'rejected' && (
                                            <button
                                                disabled={actioningId === biz.id}
                                                onClick={() => {
                                                    setRejectTarget(biz);
                                                    setRejectReason(biz.rejection_reason ?? '');
                                                }}
                                                className={'bg-red-500/90 hover:brightness-110 text-white text-sm font-black uppercase tracking-wide px-5 py-2 rounded-xl transition-all disabled:opacity-50'}
                                            >
                                                Reject
                                            </button>
                                        )}
                                        <Link
                                            href={`/business/${biz.slug}`}
                                            className={'text-sm font-bold text-slate-400 hover:text-secondary-dark transition-colors ml-auto'}
                                        >
                                            View full details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reject modal */}
            {rejectTarget && (
                <div className={'fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4'}>
                    <div className={'bg-surface-darker border border-white/10 rounded-2xl w-full max-w-md p-6'}>
                        <h3 className={'text-xl font-bold mb-1'}>Reject &quot;{rejectTarget.businessName}&quot;?</h3>
                        <p className={'text-sm text-slate-500 mb-4'}>Optionally add a reason. This is stored with the business so you remember why.</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                            placeholder={'e.g. Photos are blurry, missing contact info…'}
                            className={'w-full bg-background-darker border border-white/10 rounded-xl p-3 text-sm text-white/90 mb-5 focus:outline-none focus:border-secondary-dark'}
                        />
                        <div className={'flex justify-end gap-3'}>
                            <button
                                onClick={() => {
                                    setRejectTarget(null);
                                    setRejectReason('');
                                }}
                                className={'px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors'}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={actioningId === rejectTarget.id}
                                onClick={submitReject}
                                className={'px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wide bg-red-500 text-white hover:brightness-110 transition-all disabled:opacity-50'}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
