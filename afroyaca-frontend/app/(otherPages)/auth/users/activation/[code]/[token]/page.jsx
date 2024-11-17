import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import React from "react";
import { EmailVerification } from "@/components/otherPages/EmailVerification";


export async function generateMetadata({ params }) {
  return {
    title: "Vérification terminée | Afro Yaca Drum",
    description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
    openGraph: {
      title: "Confirmation terminée | Afro Yaca Drum",
      description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
      url: "https://afroyacadrum.com",  // Replace with the actual URL of your website
      type: "website",
      images: "/assets/images/logo-ayd.jpg",
    },
  };
}

export default function AccountOrderPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">{"Félicitations, votre compte est maintenant activé ! 🎉"}</h2>
          <div className="row">
            <EmailVerification />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
