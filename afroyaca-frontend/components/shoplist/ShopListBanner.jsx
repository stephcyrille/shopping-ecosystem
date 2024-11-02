"use client";
import { useEffect, useState } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    backgroundColor: "#f9e1e0",
    title: "Accessoires pour femmes ",
    content:
      "Que ce soit pour une soirée élégante, un cocktail ou un événement culturel.",
    imagePath: "/assets/images/shop/shop_banner3.jpg",
    alt: "Accéssoires pour femmes",
  },
  {
    id: 2,
    backgroundColor: "#f5e410",
    title: "Choisissez votre meilleur ensemble",
    content:
      "Pour une allure aérienne et féminine.",
    imagePath: "/assets/images/shop/shop_banner3.jpg",
    alt: "Choisis tomn meilleur ensemble",
  },
  {
    id: 3,
    backgroundColor: "#70ff76",
    title: "La qualité supérieure",
    content:"Ajoute une note de sensualité et facilite les mouvements, tout en restant chic et raffiné",
    imagePath: "/assets/images/shop/shop_banner3.jpg",
    alt: "Qualité supérieur",
  },
];

export default function ShopListBanner() {
  const [selectedBanner, setSelectedBanner] = useState(null)

  useEffect(() => {
    async function fetchHomeBanner() {
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/banners/shop`)
      let res_data = await res.json()
      let data = res_data.data.result

      if(data){
        setSelectedBanner(data)
      }
    }
    fetchHomeBanner()
  }, [])

  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    modules: [Autoplay, EffectFade, Pagination],
    slidesPerView: 1,
    effect: "fade",
    loop: true,
    pagination: {
      el: ".slideshow-pagination",
      type: "bullets",
      clickable: true,
    },
  };
  return (
    <Swiper
      {...swiperOptions}
      className="swiper-container js-swiper-slider slideshow slideshow_small slideshow_split"
    >
      {slides.map((elm, i) => (
        <SwiperSlide key={i} className="swiper-slide">
          <div className="slide-split h-100 d-block d-md-flex overflow-hidden">
            <div
              className="slide-split_text position-relative d-flex align-items-center"
              style={{ backgroundColor: elm.backgroundColor }}
            >
              <div className="slideshow-text container p-3 p-xl-5">
                <h2 className="text-uppercase section-title fw-normal mb-3 animate animate_fade animate_btt animate_delay-2">
                  {elm.title.split(" ").slice(0, 1).join(" ")} <br />
                  <strong>{elm.title.split(" ").slice(1).join(" ")}</strong>
                </h2>
                <p className="mb-0 animate animate_fade animate_btt animate_delay-5">
                  {elm.content}
                </p>
              </div>
            </div>
            <div className="slide-split_media position-relative">
              <div
                className="slideshow-bg"
                style={{ backgroundColor: elm.backgroundColor }}
              >
                {
                  (selectedBanner) ?
                    <Image
                      loading="lazy"
                      loader={() => selectedBanner.picture}
                      unoptimized={true}
                      src={selectedBanner.picture}
                      width="1783"
                      height="800"
                      alt="image"
                      className="slideshow-bg__img object-fit-cover object-position-right"
                    />
                    :
                    <Image
                      loading="lazy"
                      src={elm.imagePath}
                      width="630"
                      height="450"
                      alt="Women's accessories"
                      className="slideshow-bg__img object-fit-cover"
                    />
                }
              </div>
            </div>
          </div>
          {/* <!-- /.slideshow-item --> */}
        </SwiperSlide>
      ))}

      {/* <!-- /.slideshow-wrapper js-swiper-slider --> */}

      <div className="container p-3 p-xl-5">
        <div className="slideshow-pagination d-flex align-items-center position-absolute bottom-0 mb-4 pb-xl-2"></div>
        {/* <!-- /.products-pagination --> */}
      </div>
      {/* <!-- /.container --> */}
    </Swiper>
  );
}
