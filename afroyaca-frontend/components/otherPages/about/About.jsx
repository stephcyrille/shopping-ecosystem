"use client";
import { Loader } from "@/components/common/Loader";
import Image from "next/image";
import React, {useEffect, useState} from "react";

export default function About() {
  const [selectedAbout, setSelectedAbout] = useState(null)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAboutBanner() {
      setLoading(true);
      try{
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/banners/about`)
        let res_data = await res.json()
        let data = res_data.data.result
  
        if(data){
          setSelectedAbout(data)
          setLoading(false);
        }
      } catch (error){
        console.error('Error when fetching about page banner', error);
        setLoading(false);
      }
    }
    fetchAboutBanner()
  }, []);

  return (
    <>
      <Loader  isLoading={loading} />
      <section className="about-us container">
        <div className="mw-930">
          <h2 className="page-title">{"A PROPOS D'AFRO YACA DRUM"}</h2>
        </div>
        <div className="about-us__content pb-5 mb-5" style={{ textAlign: 'justify' }}>
          <p className="mb-5">
            {selectedAbout && selectedAbout.banner && <Image
              loading="lazy"
              loader={() => selectedAbout.banner.picture}
              unoptimized={true}
              src={selectedAbout.banner.picture}
              width="1783"
              height="800"
              alt="image"
              className="w-100 h-auto d-block"
            />}
          </p>
          <div className="mw-930">
            <h3 className="mb-4">{"NOTRE HISTOIRE"}</h3>
            <p className="fs-6 fw-medium mb-4">
              {"Fondée en 2016, Afro Yaca Drum est une entreprise innovante et \
              dynamique qui se distingue par sa spécialisation dans la production \
              et la vente de produits en pagnes et autres textiles africains."}
            </p>
            <div className="row mb-3">
              <div className="col-md-6">
                <h5 className="mb-3">{"Nos valeur"}</h5>
                <p className="mb-3">
                  {"Les valeurs d'Afro Yaca Drum reposent sur l'authenticité, \
                  la créativité, et la durabilité. Ils s'efforcent non seulement \
                  de créer des produits esthétiquement plaisants, mais aussi de \
                  promouvoir des pratiques éthiques et responsables."}
                </p>
              </div>
              <div className="col-md-6">
                <h5 className="mb-3">{"Notre vision"}</h5>
                <p className="mb-3">
                  {"La vision d'Afro Yaca Drum est de devenir un leader mondial dans \
                  la promotion et la valorisation des textiles africains. Ils aspirent \
                  à étendre leur influence en touchant un public international, tout en \
                  restant fidèles à leurs racines culturelles."}
                </p>
              </div>
            </div>
          </div>
          <div className="mw-930 d-lg-flex align-items-lg-center">
            <div className="image-wrapper col-lg-6">
              {selectedAbout && selectedAbout.body && <Image
                loading="lazy"
                loader={() => selectedAbout.body.picture}
                unoptimized={true}
                src={selectedAbout.body.picture}
                width="450"
                height="500"
                alt="image"
                className="h-auto"
              />}
            </div>
            <div className="content-wrapper col-lg-6 px-lg-4">
              <h5 className="mb-3">{"Notre entreprise"}</h5>
              <p>
                {"Sous la direction d'une équipe passionnée et dévouée, cette \
                entreprise dynamique est dirigée par une direction visionnaire qui \
                valorise et protège le patrimoine culturel africain. Leur dévouement \
                se manifeste à tous les niveaux, de la sélection minutieuse des tissus \
                à la conception soignée des produits. L'équipe créative d'Afro Yaca \
                Drum réunit des designers talentueux, des artisans qualifiés et des \
                experts en marketing qui travaillent ensemble pour proposer des produits \
                d'une qualité exceptionnelle."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
