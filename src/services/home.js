import { supabase } from '../lib/supabase.js';

// Get all profiles
export async function getAllPremiumProfiles() {
    try {
        const { data, error } = await supabase
            .from('swim_teacher_profiles')
            .select(`
                *,
                swim_teacher_locations (province_code),
                teacher_reviews (id, teacher_id, overall_rating, created_at)
            `)
            .eq('is_public', true)
            .eq('is_subscribed', true)
            .order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
}

// Get 5 star reviews
export async function getFiveStarReviews() {
    try {
        const { data, error } = await supabase
        .from('teacher_reviews')
        .select(`*,
            swim_teacher_profiles (
                profile_picture,
                display_name,
                is_public
            ),
            student_profiles (
                full_name
            )
        `)
        .filter('overall_rating', 'gt', '4')
        .order('created_at', { ascending: false });

        if (error) throw error;

        // 1. Filter only public teacher profiles
        const publicReviews = data.filter(
        review => review.swim_teacher_profiles?.is_public === true
        );

        // 2. Keep only one review per teacher_id
        const seen = new Set();
        const uniqueReviews = publicReviews.filter((review) => {
        if (seen.has(review.teacher_id)) return false;
        seen.add(review.teacher_id);
        return true;
        });

        // 3. Return top 10 unique reviews
        return uniqueReviews.slice(0, 10);

    } catch (error) {
        console.error('Error fetching 5 star reviews:', error);
        return [];
    }
}
