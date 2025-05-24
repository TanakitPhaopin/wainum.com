import { supabase } from '../lib/supabase.js';
import { signOut } from '../lib/auth.js';

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

// Delete the current user account
export async function deleteUserAccount(userId) {
    await signOut(); // Sign out the user before deletion
    const { error } = await supabase.functions.invoke('delete-user', {
        body: {
            userId
        },
    });
    if (error) {
        console.error('Error deleting user account:', error);
        throw error;
    }
    return true; // Return true if deletion was successful
}