import { supabase } from '../lib/supabase.js';

// Update password for the current user
export async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error('Error updating password:', error);
        throw error;
    }

    return data.user;
}

// Update user name for the current user
export async function updateUserName(newName) {
    const { data, error } = await supabase.auth.updateUser({
        data: {
            full_name: newName,
        },
    });

    if (error) {
        console.error('Error updating user name:', error);
        throw error;
    }

    return data.user;
}