import { supabase } from './supabase.js'

// Sign up
export function signUp(email, password) {
    return supabase.auth.signUp({
        email,
        password,
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