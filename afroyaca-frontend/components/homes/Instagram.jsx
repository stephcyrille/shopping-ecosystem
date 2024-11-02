import React from "react";
import Image from "next/image";

export default function Instagram() {
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
          <div className="instagram__tile">
            <a
              href="https://instagram.com"
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                src="/assets/images/home/demo6/instagram1.jpg"
                width="466"
                height="525"
                alt="Insta image 1"
              />
            </a>
          </div>
        </div>
        <div className="col-lg-4 px-0">
          <div className="instagram__tile">
            <a
              href="https://instagram.com"
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                src="/assets/images/home/demo6/instagram2.jpg"
                width="466"
                height="401"
                alt="Insta image 2"
              />
            </a>
          </div>
          <div className="instagram__tile">
            <a
              href="https://instagram.com"
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                src="/assets/images/home/demo6/instagram3.jpg"
                width="466"
                height="401"
                alt="Insta image 3"
              />
            </a>
          </div>
        </div>
        <div className="col-lg-4 px-0">
          <div className="instagram__tile">
            <a
              href="https://instagram.com"
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                src="/assets/images/home/demo6/instagram4.jpg"
                width="466"
                height="401"
                alt="Insta image 4"
              />
            </a>
          </div>
          <div className="instagram__tile">
            <a
              href="https://instagram.com"
              target="_blank"
              className="position-relative overflow-hidden d-block effect overlay-plus"
            >
              <Image
                loading="lazy"
                className="instagram__img"
                src="/assets/images/home/demo6/instagram5.jpg"
                width="466"
                height="401"
                alt="Insta image 5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
