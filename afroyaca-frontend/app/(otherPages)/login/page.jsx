import FooterAll from "@/components/footers/FooterAll";

import Header from "@/components/headers/Header";
import Login from "@/components/otherPages/Login";
import LoginRegister from "@/components/otherPages/Register";
import React from "react";

export async function generateMetadata({ params }) {
  return {
    title: "Se connecter | Boutique en ligne",
    description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
    openGraph: {
      title: "Se connecter | Boutique en ligne",
      description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
      url: "https://afroyacadrum.com",  // Replace with the actual URL of your website
      type: "website",
      images: "/assets/images/logo-ayd.jpg",
    },
  };
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Login />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
