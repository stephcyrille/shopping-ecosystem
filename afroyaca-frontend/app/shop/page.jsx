import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";

import ShopListContainer from "@/components/shoplist/ShopListContainer";
import React from "react";

export const metadata = {
  title: "Boutique | Afro Yaca Boutique en ligne",
  description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
};
export default function ShopPage6() {
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