import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getMyFavorites } from "../../services/student";
import MyCard from "../../components/Card";
import { getAllProfiles } from "../../services/search";
import { toggleFavorite } from "../../services/search";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Divider } from "@mui/material";

export default function Favourite() {
    const { user } = useAuth();
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchFavourites = async () => {
        try {
            setLoading(true);
            const rawFavorites = await getMyFavorites(user?.id);
            const favouriteIds = rawFavorites.map((favourite) => favourite.teacher_id);
            const allProfiles = await getAllProfiles();
            console.log(allProfiles);
            if (allProfiles) {
                const filteredFavourites = allProfiles.filter((profile) =>
                favouriteIds.includes(profile.id)
            );
            console.log("Fav", filteredFavourites);
            setFavourites(filteredFavourites);
            }
            setLoading(false);
        } catch (error) {
           console.error("Error fetching favourites:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavourites();
    }, []);

    // Handle star click
        const handleStarClick = async (teacher_id, student_id) => {
            if (!user) {
              toast.error("กรุณาเข้าสู่ระบบก่อน");
              return;
            }
            if (user.user_metadata.role !== "นักเรียน") {
              toast.error("คุณไม่มีสิทธิ์ในการบันทึกผู้สอน");
              return;
            }
            try {
              const result = await toggleFavorite(teacher_id, student_id);
              if (result) {
                if (result.status === 'added') {
                    setFavourites(prev => [...prev, { id: teacher_id }]);
                } else if (result.status === 'removed') {
                    setFavourites(prev => prev.filter(fav => fav.id !== teacher_id));
                }
              }
            } catch (error) {
              console.error("Error toggling favorite:", error);
            }
        }

    return (
        <div className="container">
            <h1 className="text-2xl font-semibold mb-4">ครูที่ชื่นชอบ</h1>
            <Divider/>
            <div className="my-4">
            {loading ? (
                <div></div>
            ) : favourites.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                <h2 className="text-xl font-semibold text-gray-500">ไม่มีครูที่ชื่นชอบ</h2>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {favourites.map((favourite) => (
                    <MyCard
                    display_name={favourite.display_name}
                    bio={favourite.bio}
                    key={favourite.id}
                    is_subscribed={favourite.is_subscribed}
                    levels={favourite.levels}
                    image={favourite.profile_picture}
                    hourly_rate={favourite.hourly_rate}
                    province_code={favourite.swim_teacher_locations}
                    can_online={favourite.can_online}
                    can_travel={favourite.can_travel}
                    isFavorite={favourites.some(f => f.id === favourite.id)}
                    handleStarClick={() => handleStarClick(favourite.id, user?.id)}
                    handleClick={() => navigate(`/teacher/${favourite.id}`)}
                    />
                ))}
                </div>
            )}
            </div>

        </div>
    )
}