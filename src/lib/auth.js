import { supabase } from './supabase.js'

// Sign up
export function signUp(email, password, role, username, dob) {
    return supabase.auth.signUp({
        email,
        password,
        options : {
            data: {
                role: role,
                full_name: username,
                date_of_birth: dob,
            },
            emailRedirectTo: 'http://localhost:5173/redirect' // use your domain in production
        }
    });
}

// Sign in
export function signIn(email, password) {
    return supabase.auth.signInWithPassword({
        email,
        password,
    });
}

// Sign out
export function signOut() {
    return supabase.auth.signOut();
}