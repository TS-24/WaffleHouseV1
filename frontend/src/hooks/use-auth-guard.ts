/**
 * @file use-auth-guard.ts
 * @description Custom React hook that protects routes behind Supabase authentication.
 *
 * Usage:
 *   Call `useAuthGuard()` at the top of any page component that requires
 *   a logged-in user. The hook performs two checks:
 *
 *   1. **On mount** — queries the current Supabase session. If no active
 *      session exists the user is immediately redirected to `/auth`.
 *
 *   2. **Ongoing listener** — subscribes to Supabase's `onAuthStateChange`
 *      so that if the user signs out in another tab (or the session expires)
 *      they are redirected in real time. The subscription is cleaned up
 *      when the component unmounts to avoid memory leaks.
 *
 * @see https://supabase.com/docs/reference/javascript/auth-getSession
 * @see https://supabase.com/docs/reference/javascript/auth-onauthstatechange
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function useAuthGuard() {
    const navigate = useNavigate();

    // Check for an existing session on mount — redirect if unauthenticated
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/auth");
            }
        };
        checkAuth();
    }, [navigate]);

    // Subscribe to auth state changes (sign-out, token expiry, etc.)
    // and redirect to the login page when the session becomes invalid.
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                navigate("/auth");
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [navigate]);
}
