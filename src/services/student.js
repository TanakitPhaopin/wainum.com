import { supabase } from '../lib/supabase.js';

// Get my favorites
export async function getMyFavorites(student_id) {
    try {
        const { data, error } = await supabase
            .from('student_favorite_teacher')
            .select('teacher_id')
            .eq('student_id', student_id);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching my favorites:', error);
        return [];
    }
}