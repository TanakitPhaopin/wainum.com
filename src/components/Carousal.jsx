import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function MyCarousel({Content, container_style}) {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()])

  return (
    <div className={`embla ${container_style}`} ref={emblaRef}>
      <div className="embla__container">
        {/* <div className="embla__slide">Slide 1</div> */}
        <Content />
      </div>
    </div>
  )
}
