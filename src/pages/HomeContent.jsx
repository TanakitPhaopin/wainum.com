import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getAllPremiumProfiles } from "../services/home";
import MyCard from "../components/Card";
import { useNavigate } from "react-router";

export default function HomeContent({ deviceType }) {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsToShow_large = profiles.length < 4 ? profiles.length : 4;
    const itemsToShow_desktop = profiles.length < 3 ? profiles.length : 3;
    const itemsToShow_tablet = profiles.length < 2 ? profiles.length : 2;
    const itemsToShow_mobile = profiles.length < 1 ? profiles.length : 1;
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1536 },
            items: itemsToShow_large,
            slidesToSlide: 1,
        },
        largeDesktop: {
            breakpoint: { max: 1536, min: 1280 },
            items: itemsToShow_large,
            slidesToSlide: 1,
        },
        desktop: {
            breakpoint: { max: 1280, min: 1024 },
            items: itemsToShow_desktop,
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: itemsToShow_tablet,
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: itemsToShow_mobile,
            slidesToSlide: 1,
        },
    };

    const fetchProfiles = async () => {
      try {
          setLoading(true);
          const profiles = await getAllPremiumProfiles();
          console.log(profiles);
          setProfiles(profiles);
          setLoading(false);
      }
        catch (error) {
          console.error("Error fetching profiles:", error);
          setLoading(false);
      }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);
      

  return (
    <>
    {!loading && profiles.length !== 0 && (
      <>
      <h1 className="text-xl font-semibold mb-2 text-black">สปอนเซอร์</h1>
      <div className="w-full min-h-[300px] flex items-center justify-center">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={false}
          responsive={responsive}
          ssr={true} 
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={false}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
          deviceType={deviceType}
          dotListClass="custom-dot-list-style"
          itemClass="px-0 sm:px-2"
        >
          {profiles.map((profile) => (
              <MyCard
                id={profile.id}
                display_name={profile.display_name}
                bio={profile.bio}
                is_subscribed={profile.is_subscribed}
                levels={profile.levels}
                image={profile.profile_picture}
                hourly_rate={profile.hourly_rate}
                province_code={profile.swim_teacher_locations}
                can_online={profile.can_online}
                can_travel={profile.can_travel}
                handleClick={() => navigate(`/teacher/${profile.id}`)}
              />
          ))}
        </Carousel>
      </div>
      </>
    )}
    </>
  );
}
