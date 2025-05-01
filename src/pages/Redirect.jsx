import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';

export default function Redirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true); // track profile check

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (loading) return; // wait for auth to finish
      if (!user) {
        navigate('/', { replace: true }); // not logged in
        return;
      }

      // Check if user profile exists
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!data || error) {
        console.log('No profile found or error:', error);
        navigate('/profile/setup', { replace: true }); // no profile
      } else {
        const role = user.user_metadata?.role;

        if (role === 'ครูสอนว่ายน้ำ') {
          navigate('/teacher/dashboard', { replace: true });
        } else if (role === 'นักเรียน') {
          navigate('/student/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true }); // default fallback
        }
      }

      setChecking(false); // done
    };

    checkProfileAndRedirect();
  }, [user, loading, navigate]);

  return null; // nothing shown while redirecting
}
