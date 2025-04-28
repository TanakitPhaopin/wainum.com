import React,{ createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({user: null, session: null });

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);

    useEffect(() => {
        // get initial session
        supabase.auth.getSession().then(({data}) => {
            console.log("Initial session", data);
            setSession(data.session);
        });

        // listen for changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                console.log("Auth state changed", { _event, newSession });
                setSession(newSession);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user: session?.user ?? null, session }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}