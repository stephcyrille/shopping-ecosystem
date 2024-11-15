import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import Dashboard from "@/components/otherPages/Dashboard";
import DashboardSidebar from "@/components/otherPages/DashboardSidebar";
import React from "react";


export async function generateMetadata({ params }) {
  return {
    title: "Dashboard | Afro Yaca Drum",
    description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
    openGraph: {
      title: "Dashboard | Afro Yaca Drum",
      description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
      url: "https://afroyacadrum.com",  // Replace with the actual URL of your website
      type: "website",
      images: "/assets/images/logo-ayd.jpg",
    },
  };
}

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">{"Tableau de bord"}</h2>
          <div className="row">
            <DashboardSidebar />
            <Dashboard />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
