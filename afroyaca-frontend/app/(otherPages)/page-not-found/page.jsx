import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import Notfound from "@/components/otherPages/Notfound";

export const metadata = {
  title: "Page Not Found || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function PageNotFound() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Notfound />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
