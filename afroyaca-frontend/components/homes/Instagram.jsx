'use client'

import React, {useState, useEffect} from "react";
import Image from "next/image";

export default function Instagram() {
  const [instagramPictList, setInstagramPictList] = useState([])


  useEffect(() => {
    async function fetchHomeCollectionList() {
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/pictures/instagram`);
      let res_data = await res.json();
      let data = res_data.data.result;

      if(data.length > 0){
        console.log(data)
        setInstagramPictList(data);
      }
    }
    fetchHomeCollectionList();
  }, [])


  return (
    <section className="instagram container">
      <div className="row">
        <div className="col-lg-4 px-0 d-flex flex-column">
          <div className="instagram__tile flex-1 d-flex">
            <div className="d-flex flex-column justify-content-center text-white bg-black px-4 px-xl-5 py-3">
              <h2 className="fs-35 fw-normal text-white mb-2">#AfroYacadrum</h2>
              <p className="mb-0">
                {"Ajoutez une touche d'originalité à votre garde-robe avec l'ensemble Top et Maxi Jupe 'Maïra'."} 
                {"Commandez dès maintenant et exprimez votre style."}
              </p>
            </div>
          </div>
          {instagramPictList[0] && <div className="instagram__tile">
            <a
              href={instagramPictList[0].url}
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                loader={() => instagramPictList[0].picture}
                unoptimized={true}
                src={instagramPictList[0].picture}
                width="466"
                height="525"
                alt="Insta image 1"
              />
            </a>
          </div>}
        </div>
        <div className="col-lg-4 px-0">
          {instagramPictList[1] && <div className="instagram__tile">
            <a
              href={instagramPictList[1].url}
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                loader={() => instagramPictList[1].picture}
                unoptimized={true}
                src={instagramPictList[1].picture}
                width="466"
                height="401"
                alt="Insta image 2"
              />
            </a>
          </div>}

          {instagramPictList[2] && <div className="instagram__tile">
            <a
              href={instagramPictList[2].url}
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                loader={() => instagramPictList[2].picture}
                unoptimized={true}
                src={instagramPictList[2].picture}
                width="466"
                height="401"
                alt="Insta image 3"
              />
            </a>
          </div>}
        </div>
        <div className="col-lg-4 px-0">
          {instagramPictList[3] && <div className="instagram__tile">
            <a
              href={instagramPictList[3].url}
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                loader={() => instagramPictList[3].picture}
                unoptimized={true}
                src={instagramPictList[3].picture}
                width="466"
                height="401"
                alt="Insta image 4"
              />
            </a>
          </div>}
          {instagramPictList[4] && <div className="instagram__tile">
            <a
              href={instagramPictList[4].url}
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                loader={() => instagramPictList[4].picture}
                unoptimized={true}
                src={instagramPictList[4].picture}
                width="466"
                height="431"
                alt="Insta image 5"
              />
            </a>
          </div>}
        </div>
      </div>
    </section>
  );
}
