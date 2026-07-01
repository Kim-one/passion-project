export interface BusinessImage {
    id: number;
    business_id: number;
    path: string;
    type: 'hero' | 'gallery';
    url: string;
    created_at: string;
    updated_at: string;
}