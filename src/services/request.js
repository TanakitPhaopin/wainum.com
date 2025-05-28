import { supabase } from "../lib/supabase";

// Send a request to a teacher
export async function sendRequestToTeacher(data) {
    const { student_id, teacher_id, message, phone } = data;
    try {
        const { error } = await supabase
            .from('student_requests')
            .insert([
                {
                    student_id,
                    teacher_id,
                    request_message: message,
                    phone_number: phone,
                    request_status: 'pending',
                },
            ]);
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error sending request to teacher:', error);
        return false;
    }
}

// Check if a request already exists
export async function checkExistingRequest(student_id, teacher_id) {
    try {
        const { data, error } = await supabase
            .from('student_requests')
            .select('*')
            .eq('student_id', student_id)
            .eq('teacher_id', teacher_id)
            .single();

        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        // console.error('Error checking existing request:', error);
        return false;
    }
}

// Get all my requests
export async function getMyRequests(student_id) {
    try {
        const { data, error } = await supabase
            .from('student_requests')
            .select(`*,
                swim_teacher_profiles (
                    id,
                    display_name,
                    profile_picture,
                    contacts,
                    is_subscribed)`
                )
            .eq('student_id', student_id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching my requests:', error);
        return [];
    }
}

// Delete a request
export async function deleteRequest(request_id) {
    try {
        const { error } = await supabase
            .from('student_requests')
            .delete()
            .eq('request_id', request_id)

        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error deleting request:', error);
        return false;
    }
}

// Update the request (request status, teacher response comment, teacher response time, show_teacher_contacts)
export async function updateRequest(request_id, data) {
    const { request_status, teacher_response_comment, teacher_response_time, show_teacher_contacts } = data;
    try {
        const { error } = await supabase
            .from('student_requests')
            .update({
                request_status,
                teacher_response_comment,
                teacher_response_time,
                show_teacher_contacts,
            })
            .eq('request_id', request_id);

        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error('Error updating request:', error);
        return false;
    }
}