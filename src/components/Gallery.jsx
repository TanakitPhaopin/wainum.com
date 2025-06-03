import ImageGallery from "react-image-gallery";

export default function MyGallery({ images }) {
    return (
        <ImageGallery 
            items={images} 
            showThumbnails={true}
            showFullscreenButton={false}
            showPlayButton={false}
            autoPlay={true}
            slideInterval={3000}
            showBullets={true}
            showNav={true}
            slideDuration={500}
            thumbnailPosition={"bottom"}
        />
    );
}