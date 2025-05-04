import { supabase } from '../lib/supabase.js';

// Get all profiles
export async function getAllProfiles() {
    try {
        const { data, error } = await supabase
            .from('swim_teacher_profiles')
            .select('*')
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
