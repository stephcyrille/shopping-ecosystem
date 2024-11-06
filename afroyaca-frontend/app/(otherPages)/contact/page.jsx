import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import Contact from "@/components/otherPages/Contact/Contact";
import LocationMap from "@/components/otherPages/Contact/LocationMap";
import React from "react";

export async function generateMetadata({ params }) {
  return {
    title: "Contactez-nous | Afro Yaca Boutique en ligne",
    description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
    openGraph: {
      title: "Contactez-nous | Afro Yaca Boutique en ligne",
      description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
      url: "https://afroyacadrum.com",  // Replace with the actual URL of your website
      type: "website",
      images: "/assets/images/logo-ayd.jpg",
    }
  };
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="contact-us container">
          <div className="mw-930">
            <h2 className="page-title">{'CONTACTEZ-NOUS'}</h2>
          </div>
        </section>

        <section className="google-map mb-5">
          <h2 className="d-none">{'Retrouvez nous'}</h2>
          <div id="map" className="google-map__wrapper">
            <LocationMap />
          </div>
        </section>
        <Contact />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
