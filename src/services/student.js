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

export async function IsMyFavorite(teacher_id, student_id) {
    try {
        const { data, error } = await supabase
            .from('student_favorite_teacher')
            .select('teacher_id')
            .eq('teacher_id', teacher_id)
            .eq('student_id', student_id);
        if (error) {
            throw error;
        }
        return data.length > 0;
    } catch (error) {
        console.error('Error checking if favorite:', error);
        return false;
    }
}

// Create student profile
export async function createStudentProfile(studentData) {
    const { student_id, full_name, initial, email, profile_color } = studentData;
    try {
        const { error } = await supabase
            .from('student_profiles')
            .insert([
                {
                    student_id,
                    full_name,
                    initial,
                    email,
                    profile_color,
                },
            ]);
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error creating student profile:', error);
        return false;
    }
}