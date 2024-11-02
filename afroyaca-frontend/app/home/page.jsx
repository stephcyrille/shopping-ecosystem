import React from 'react'
import FooterHome from "@/components/footers/FooterHome";

import Header from "@/components/headers/Header";
import CategoryMassonry from "@/components/homes/CategoryMassonry";
import Hero from "@/components/homes/Hero";
import Instagram from "@/components/homes/Instagram";

export const metadata = {
  title: "Afro Yaca Drum | Boutique en ligne",
  description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
};
export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "76px" }}>
        <Hero />
        <div className="mb-4 mb-xl-5 pt-1 pb-5"></div>
        <CategoryMassonry />
        <Instagram />
        <div className="mb-4 mb-xl-5 pt-xl-1 pb-5"></div>
      </main>
      <FooterHome />
    </>
  );
}