import {BusinessImage} from "@/app/BusinessImage";
import {BusinessSocialLinks} from "@/app/BusinessSocialLinks";
import {BusinessHours} from "@/app/BusinessHours";

export interface Business {
    id: number;
    businessName: string;
    slogan: string;
    category: string;
    city: string;
    description: string;
    parish: string;
    slug: string;
    streetAddress: string;
    user_id: number;
    rating: number;
    reviewCount: number;
    featured: boolean;
    verified: boolean;
    about: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    images: BusinessImage[];
    socialLinks: BusinessSocialLinks[];
    hours: BusinessHours[];
    created_at: string;
    updated_at: string;
}