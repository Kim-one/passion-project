export interface BusinessSocialLinks {
    id: number;
    business_id: number;
    platform: 'instagram' | 'twitter' | 'facebook';
    url: string;
}