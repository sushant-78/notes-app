import React, { useContext, useState, useEffect } from "react";
import { supabaseClient } from "../supaClient";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const session = supabaseClient.auth.session();

        setUser(session?.user ?? null);
        setLoading(false);

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: listener } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            listener?.unsubscribe();
        };
    }, []);

    // Will be passed down to Signup, Login and Dashboard components
    const value = {
        signUp: (data) => supabaseClient.auth.signUp(data),
        signIn: (data) => supabaseClient.auth.signIn(data),
        signOut: () => supabaseClient.auth.signOut(),
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
