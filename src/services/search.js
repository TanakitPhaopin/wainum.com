import { supabase } from '../lib/supabase.js';
import { calculateAverageResponseTime } from './request.js';


// Get all profiles
export async function getAllProfiles() {
    try {
        let { data, error } = await supabase
            .from('swim_teacher_profiles')
            .select(`
                *,
                swim_teacher_locations (province_code),
                teacher_reviews (id, teacher_id, overall_rating, created_at),
                student_requests (*)
            `)
            .eq('is_public', true)
            .order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        if (data) {
          {data = data.map(profile => {
              // Calculate average response time for each profile
              const averageResponseTime = calculateAverageResponseTime(profile?.student_requests);
              return {
                  ...profile,
                  average_response_time: averageResponseTime,
              };
          }
          );
          }
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
        let { data, error } = await supabase
            .from('swim_teacher_profiles')
            .select(`
                *,
                swim_teacher_locations (province_code),
                student_requests (*),
                swim_teacher_gallery (image_url)
            `)
            .eq('id', id)
            .single();
        if (error) {
            throw error;
        }

        // Calculate average response time
        if (data) {
            const averageResponseTime = calculateAverageResponseTime(data?.student_requests);
            data = {
              ...data,
              average_response_time: averageResponseTime,
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching teacher by ID:', error);
        return null;
    }
}

// Student favorite
export async function toggleFavorite(teacher_id, student_id) {
  try {
    if (!student_id) {
      throw new Error('User not authenticated');
    }

    // First, check if the favorite already exists
    const { data: existing, error: fetchError } = await supabase
      .from('student_favorite_teacher')
      .select('id')
      .eq('teacher_id', teacher_id)
      .eq('student_id', student_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching favorite:', fetchError);
      throw fetchError;
    }

    if (existing) {
      // ✅ Exists — delete it
      const { error: deleteError } = await supabase
        .from('student_favorite_teacher')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
      return { status: 'removed' };
    } else {
        // ✅ Does not exist — insert it
        const { data: newFavorite, error: insertError } = await supabase
            .from('student_favorite_teacher')
            .insert({ teacher_id, student_id })
            .single();

      if (insertError) throw insertError;
      return { status: 'added', data: newFavorite };
    }
  } catch (error) {
    throw error;
  }
}

// Get student favorites
export async function getStudentFavorites(student_id) {
    try {
        if (!student_id) {
        throw new Error('User not authenticated');
        }
    
        const { data, error } = await supabase
        .from('student_favorite_teacher')
        .select('teacher_id')
        .eq('student_id', student_id);
    
        if (error) {
        throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching student favorites:', error);
        return [];
    }
    }

