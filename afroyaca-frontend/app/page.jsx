import HomePage from "./home/page";

export const metadata = {
  title: "Afro Yaca Drum | Boutique en ligne",
  description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
  openGraph: {
    title: "Afro Yaca Drum | Boutique en ligne",
    description: "Achétez tous les produits Afro Chic made by Afro Yaca dans notre boutique en ligne",
    url: "https://afroyacadrum.com",  // Replace with the actual URL of your website
    type: "website",
    images: "/assets/images/logo-ayd.jpg",
  },
};
export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
