import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";

import ChectoutSteps from "@/components/shopCartandCheckout/ChectoutSteps";
import OrderCompleted from "@/components/shopCartandCheckout/OrderCompleted";
import React from "react";

export const metadata = {
  title: "Commande terminée | Afro Yaca Boutique en ligne",
  description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
};

export default function () {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="shop-checkout container">
          <h2 className="page-title">{"COMMANDE REÇUE"}</h2>
          <ChectoutSteps />
          <OrderCompleted />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
