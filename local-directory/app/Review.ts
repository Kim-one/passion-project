export interface Review {
    id: number;
    business_id: number;
    user_id: number;
    rating: number;
    body: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
    }
}