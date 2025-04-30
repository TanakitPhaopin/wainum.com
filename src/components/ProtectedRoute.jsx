import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Redirect() {
  const { user, loading } = useAuth();
  useEffect(() => {
    console.log("User in Redirect:", user);
    console.log("Loading in Redirect:", loading);
    }, [user, loading]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // ✅ wait for session

    if (!user) {
      navigate("/", { replace: true });
    } else {
      const role = user.user_metadata?.role;

      if (!role) {
        navigate("/profile/setup", { replace: true });
      } else if (role === "ครูสอนว่ายน้ำ") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (role === "นักเรียน") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/not-authorized", { replace: true });
      }
    }
  }, [user, loading]);

  return (
    <div className="flex justify-center items-center h-screen text-gray-600">
      กำลังเปลี่ยนเส้นทาง...
    </div>
  );
}
