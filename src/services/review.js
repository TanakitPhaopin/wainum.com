import { supabase } from "../lib/supabase";

// Get all reviews for a teacher
export async function getTeacherReviews(teacher_id) {
    try {
        const { data, error } = await supabase
            .from('teacher_reviews')
            .select(`*,
                student_profiles(*)
                `)
            .eq('teacher_id', teacher_id)
            .order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}


// Insert a new review
export async function insertReview(data) {
    const { 
        student_id,
        teacher_id,
        reviewComment,
        overRallRating,
        teachingSkillRating, 
        onTimeRating, 
        communicationRating, 
    } = data;
    try {
        const { error } = await supabase
            .from('teacher_reviews')
            .insert([
                {
                    student_id: student_id,
                    teacher_id: teacher_id,
                    review_comment: reviewComment,
                    overall_rating: overRallRating,
                    teaching_skill_rating: teachingSkillRating,
                    on_time_rating: onTimeRating,
                    communication_rating: communicationRating,
                }
            ]);
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error inserting review:', error);
        return false;
    }
}

// Delete my review
export async function deleteMyReview(review_id) {
    try {
        const { error } = await supabase
            .from('teacher_reviews')
            .delete()
            .eq('id', review_id);
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error deleting review:', error);
        return false;
    }
}

// Upsert a reply
export async function updateReply(data) {
    const { review_id, reply_comment } = data;
    try {
        const { error } = await supabase
            .from('teacher_reviews')
            .update({reply_comment})
            .eq('id', review_id);
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error upserting reply:', error);
        return false;
    }
}