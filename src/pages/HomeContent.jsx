import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function HomeContent({ deviceType }) {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1536 },
            items: 4,
            slidesToSlide: 1,
        },
        largeDesktop: {
            breakpoint: { max: 1536, min: 1280 },
            items: 4,
            slidesToSlide: 1,
        },
        desktop: {
            breakpoint: { max: 1280, min: 1024 },
            items: 3,
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: 2,
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };
      

  return (
    <div className="w-full h-[300px] bg-amber-300 flex items-center justify-center">
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={false}
        responsive={responsive}
        ssr={true} 
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={false}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        deviceType={deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        <div className="h-[300px] flex items-center justify-center bg-blue-400 text-white text-lg">
          Item 1
        </div>
        <div className="h-[300px] flex items-center justify-center bg-green-400 text-white text-lg">
          Item 2
        </div>
        <div className="h-[300px] flex items-center justify-center bg-red-400 text-white text-lg">
          Item 3
        </div>
        <div className="h-[300px] flex items-center justify-center bg-purple-400 text-white text-lg">
          Item 4
        </div>
      </Carousel>
    </div>
  );
}
