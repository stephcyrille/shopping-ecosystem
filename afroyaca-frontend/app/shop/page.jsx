import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";

import ShopListContainer from "@/components/shoplist/ShopListContainer";
import React from "react";

export async function generateMetadata({ params }) {
  return {
    title: "Boutique | Afro Yaca Boutique en ligne",
    description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
    openGraph: {
      title: "Afro Yaca Drum | Boutique en ligne",
      description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
      url: "https://afroyacadrum.com",  // Replace with the actual URL of your website
      type: "website",
      images: "/assets/images/logo-ayd.jpg",
    }
  };
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <ShopListContainer />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}