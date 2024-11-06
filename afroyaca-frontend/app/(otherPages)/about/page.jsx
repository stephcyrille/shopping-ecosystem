import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import About from "@/components/otherPages/about/About";
import Clients from "@/components/otherPages/about/Clients";
import Services from "@/components/otherPages/about/Services";
import React from "react";

export async function generateMetadata({ params }) {
  return {
    title: "A propos de nous | Afro Yaca Boutique en ligne",
    description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
    openGraph: {
      title: "A propos de nous | Afro Yaca Boutique en ligne",
      description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
      url: "https://afroyacadrum.com",  // Replace with the actual URL of your website
      type: "website",
      images: "/assets/images/logo-ayd.jpg",
    }
  };
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <About />
        <Services />
        {/* <Clients /> */}
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
