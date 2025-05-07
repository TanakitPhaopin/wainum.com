import { supabase } from '../lib/supabase.js';

// Get all profiles
export async function getAllProfiles() {
    try {
        const { data, error } = await supabase
            .from('swim_teacher_profiles')
            .select(`
                *,
                swim_teacher_locations (province_code)
            `)
            .eq('is_public', true)
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

// Get Teacher by ID
export async function getTeacherById(id) {
    try {
        const { data, error } = await supabase
            .from('swim_teacher_profiles')
            .select(`
                *,
                swim_teacher_locations (province_code)
            `)
            .eq('id', id)
            .single();
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching teacher by ID:', error);
        return null;
    }
}
