import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

export default function Redirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (loading) return; // Wait for loading to finish
    const role = user?.user_metadata?.role;
    const redirectTo = role === 'ครูสอนว่ายน้ำ' ? '/teacher/profile' : '/search';
    if (user) {
      // User is logged in, redirect to the appropriate dashboard
      navigate(redirectTo);
    } else {
      // User is not logged in, redirect to the login page
      navigate('/');
    }
  }, [user, loading, navigate]);
  return null; // nothing shown while redirecting
}
