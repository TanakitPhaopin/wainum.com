import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

export default function Redirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);
 
  useEffect(() => {
    if (loading || hasRedirected.current) return; // Wait for loading to finish

    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    const role = user?.user_metadata?.role;
    let redirectTo = '/search'; // fallback

    if (role === 'ครูสอนว่ายน้ำ') {
      redirectTo = '/teacher/profile';
    } else if (role === 'นักเรียน') {
      const savedRedirect = localStorage.getItem("redirectAfterLogin");
      redirectTo = savedRedirect || '/search';
      localStorage.removeItem("redirectAfterLogin");
    }

    hasRedirected.current = true; // ✅ prevent future runs
    navigate(redirectTo, { replace: true });
  }, [user, loading, navigate]);
  return null; // nothing shown while redirecting
}
