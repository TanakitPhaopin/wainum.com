import { supabase } from "../lib/supabase";

// Get all requests for a teacher
export async function getTeacherRequests(teacher_id) {
    try {
        const { data, error } = await supabase
            .from('student_requests')
            .select(`*,
                student_profiles (
                    student_id,
                    full_name,
                    profile_color,
                    initial)`)
            .eq('teacher_id', teacher_id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching teacher requests:', error);
        return [];
    }
}