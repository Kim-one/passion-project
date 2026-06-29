export interface BusinessHours {
    id: number;
    business_id: number;
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
}