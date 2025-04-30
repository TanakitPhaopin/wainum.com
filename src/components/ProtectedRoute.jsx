import { useState, useEffect} from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";

// export default function ProtectedRoute({ children }) {
//     const { user } = useAuth();
//     return user ? children : <Navigate to="/" replace/>
// }

export default function ProtectedRoute({ children, requiredRole = null }) {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadProfile = async () => {
        if (!user) return setLoading(false);
  
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();
  
        if (data) setProfile(data);
        setLoading(false);
      };
  
      loadProfile();
    }, [user]);
  
    if (!user) return <Navigate to="/" replace />;
    if (loading) return null;
  
    if (!profile) return <Navigate to="/profile/setup" replace />;
  
    if (requiredRole && profile.role !== requiredRole) {
      return <Navigate to="/not-authorized" replace />;
    }
  
    return children;
  }
  