import TestimonialCard from "~/components/marketing/TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Keyboard, Navigation } from "swiper/modules";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCallback, useRef } from "react";

const testimonials = [
  {
    content:
      "Thank you very much for your options calculator. It is a fantastic tool.",
    author: {
      name: "Dwayne Prescott",
      role: "Miami, Florida",
    },
  },
  {
    content: "I always use OpCalc before making any crazy option trades.",
    author: {
      name: "Nick Jordan",
      role: "Latvia, Europe",
    },
  },
  {
    content: "I always use OpCalc before making any crazy option trades.",
    author: {
      name: "Nick Jordan",
      role: "Latvia, Europe",
    },
  },
  {
    content:
      "Thank you very much for your options calculator.  It is a fantastic tool. ",
    author: {
      name: "Dwayne Prescott",
      role: "Miami, Florida",
    },
  },
  {
    content: "Thanks for making the site. It's very helpful.",
    author: {
      name: "Don Hejna",
      role: "San Francisco, CA",
    },
  },
];

export function QuoteIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  );
}

export function Testimonials() {
  const [slideInfo, setSlideInfo] = useState(null);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    console.log(slideInfo);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sliderRef.current.swiper.slideNext();
  }, []);

  const handleSlideChange = (slider) => {
    setSlideInfo({
      activeIndex: slider?.activeIndex,
      slidesCount: slider?.slides?.length,
    });
  };

  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="py-20 sm:py-32"
    >
      <h2 className="mb-12 text-center text-3xl font-bold text-black sm:text-4xl">
        Loved by traders,{" "}
        <span className="italic text-[#2D78C8]">worldwide</span>
      </h2>
      <Swiper
        ref={sliderRef}
        className="my-10"
        cssMode={true}
        navigation={{
          enabled: true,
          prevEl: "prev-slide",
          nextEl: "next-slide",
        }}
        mousewheel={true}
        keyboard={true}
        modules={[Pagination, Mousewheel, Keyboard, Navigation]}
        slidesPerView={isTabletOrMobile ? 2 : 1}
        spaceBetween={isTabletOrMobile ? 30 : -900}
        centeredSlides={true}
        onSlideChange={handleSlideChange}
        pagination={
          isTabletOrMobile
            ? false
            : {
                clickable: true,
              }
        }
      >
        {testimonials.map((t, i) => (
          <SwiperSlide
            className={"mb-16 " + (isTabletOrMobile ? "!w-2/3" : "")}
            key={i}
          >
            <TestimonialCard
              content={t.content}
              author={t.author.name}
              address={t.author.role}
            />
          </SwiperSlide>
        ))}
        <div className="flex w-full items-center justify-center gap-12 text-white sm:hidden">
          <button id="prev-slide" onClick={handlePrev}>
            <svg
              width="27"
              height="26"
              viewBox="0 0 27 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 0C10.9288 0 8.41543 0.762437 6.27759 2.1909C4.13975 3.61935 2.47351 5.64968 1.48957 8.02512C0.505633 10.4006 0.248189 13.0144 0.749797 15.5362C1.25141 18.0579 2.48953 20.3743 4.30762 22.1924C6.1257 24.0105 8.44208 25.2486 10.9638 25.7502C13.4856 26.2518 16.0995 25.9944 18.4749 25.0104C20.8503 24.0265 22.8807 22.3603 24.3091 20.2224C25.7376 18.0846 26.5 15.5712 26.5 13C26.4964 9.5533 25.1256 6.24882 22.6884 3.81163C20.2512 1.37445 16.9467 0.00363977 13.5 0ZM13.5 24C11.3244 24 9.19767 23.3549 7.38873 22.1462C5.57979 20.9375 4.16989 19.2195 3.33733 17.2095C2.50477 15.1995 2.28693 12.9878 2.71137 10.854C3.13581 8.72022 4.18345 6.7602 5.72183 5.22183C7.26021 3.68345 9.22022 2.6358 11.354 2.21136C13.4878 1.78692 15.6995 2.00476 17.7095 2.83733C19.7195 3.66989 21.4375 5.07979 22.6462 6.88873C23.8549 8.69767 24.5 10.8244 24.5 13C24.4967 15.9164 23.3367 18.7123 21.2745 20.7745C19.2123 22.8367 16.4164 23.9967 13.5 24ZM19.5 13C19.5 13.2652 19.3946 13.5196 19.2071 13.7071C19.0196 13.8946 18.7652 14 18.5 14H10.9138L13.2075 16.2925C13.3004 16.3854 13.3741 16.4957 13.4244 16.6171C13.4747 16.7385 13.5006 16.8686 13.5006 17C13.5006 17.1314 13.4747 17.2615 13.4244 17.3829C13.3741 17.5043 13.3004 17.6146 13.2075 17.7075C13.1146 17.8004 13.0043 17.8741 12.8829 17.9244C12.7615 17.9747 12.6314 18.0006 12.5 18.0006C12.3686 18.0006 12.2385 17.9747 12.1171 17.9244C11.9957 17.8741 11.8854 17.8004 11.7925 17.7075L7.79251 13.7075C7.69953 13.6146 7.62577 13.5043 7.57545 13.3829C7.52512 13.2615 7.49922 13.1314 7.49922 13C7.49922 12.8686 7.52512 12.7385 7.57545 12.6171C7.62577 12.4957 7.69953 12.3854 7.79251 12.2925L11.7925 8.2925C11.9801 8.10486 12.2346 7.99944 12.5 7.99944C12.7654 7.99944 13.0199 8.10486 13.2075 8.2925C13.3951 8.48014 13.5006 8.73464 13.5006 9C13.5006 9.26536 13.3951 9.51986 13.2075 9.7075L10.9138 12H18.5C18.7652 12 19.0196 12.1054 19.2071 12.2929C19.3946 12.4804 19.5 12.7348 19.5 13Z"
                fill="#2D78C8"
              />
            </svg>
          </button>
          <button id="next-slide" onClick={handleNext}>
            <svg
              width="27"
              height="26"
              viewBox="0 0 27 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 0C10.9288 0 8.41543 0.762437 6.27759 2.1909C4.13975 3.61935 2.47351 5.64968 1.48957 8.02512C0.505633 10.4006 0.248189 13.0144 0.749797 15.5362C1.25141 18.0579 2.48953 20.3743 4.30762 22.1924C6.1257 24.0105 8.44208 25.2486 10.9638 25.7502C13.4856 26.2518 16.0995 25.9944 18.4749 25.0104C20.8503 24.0265 22.8807 22.3603 24.3091 20.2224C25.7376 18.0846 26.5 15.5712 26.5 13C26.4964 9.5533 25.1256 6.24882 22.6884 3.81163C20.2512 1.37445 16.9467 0.00363977 13.5 0ZM13.5 24C11.3244 24 9.19767 23.3549 7.38873 22.1462C5.57979 20.9375 4.16989 19.2195 3.33733 17.2095C2.50477 15.1995 2.28693 12.9878 2.71137 10.854C3.13581 8.72022 4.18345 6.7602 5.72183 5.22183C7.26021 3.68345 9.22022 2.6358 11.354 2.21136C13.4878 1.78692 15.6995 2.00476 17.7095 2.83733C19.7195 3.66989 21.4375 5.07979 22.6462 6.88873C23.8549 8.69767 24.5 10.8244 24.5 13C24.4967 15.9164 23.3367 18.7123 21.2745 20.7745C19.2123 22.8367 16.4164 23.9967 13.5 24ZM19.2075 12.2925C19.3005 12.3854 19.3742 12.4957 19.4246 12.6171C19.4749 12.7385 19.5008 12.8686 19.5008 13C19.5008 13.1314 19.4749 13.2615 19.4246 13.3829C19.3742 13.5043 19.3005 13.6146 19.2075 13.7075L15.2075 17.7075C15.0199 17.8951 14.7654 18.0006 14.5 18.0006C14.2346 18.0006 13.9801 17.8951 13.7925 17.7075C13.6049 17.5199 13.4994 17.2654 13.4994 17C13.4994 16.7346 13.6049 16.4801 13.7925 16.2925L16.0863 14H8.50001C8.23479 14 7.98044 13.8946 7.7929 13.7071C7.60536 13.5196 7.50001 13.2652 7.50001 13C7.50001 12.7348 7.60536 12.4804 7.7929 12.2929C7.98044 12.1054 8.23479 12 8.50001 12H16.0863L13.7925 9.7075C13.6049 9.51986 13.4994 9.26536 13.4994 9C13.4994 8.73464 13.6049 8.48014 13.7925 8.2925C13.9801 8.10486 14.2346 7.99944 14.5 7.99944C14.7654 7.99944 15.0199 8.10486 15.2075 8.2925L19.2075 12.2925Z"
                fill="#2D78C8"
              />
            </svg>
          </button>
        </div>
      </Swiper>
    </section>
  );
}
