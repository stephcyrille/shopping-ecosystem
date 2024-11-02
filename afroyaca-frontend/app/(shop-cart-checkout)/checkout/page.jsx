import Footer from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import Checkout from "@/components/shopCartandCheckout/Checkout";
import ChectoutSteps from "@/components/shopCartandCheckout/ChectoutSteps";
import React from "react";

export const metadata = {
  title: "Panier (livraison) | Afro Yaca Boutique en ligne",
  description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
};

export default function () {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="shop-checkout container">
          <h2 className="page-title">{"Livraison et paiement"}</h2>
          <ChectoutSteps />
          <Checkout />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer />
    </>
  );
}
