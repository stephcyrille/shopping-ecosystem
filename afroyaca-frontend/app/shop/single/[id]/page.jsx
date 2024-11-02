import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import ShopSingleProduct from "@/components/singleProduct/ShopSingleProduct";
import { notFound } from "next/navigation";
import React from "react";

// Fetch the product details
async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/products/single/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data_parsed = await res.json();
  return data_parsed.data.result.product;
}

// Dynamic metadata function
export async function generateMetadata({ params }) {
  const productId = params.id;
  const product = await getProduct(productId);

  if (!product) {
    return {
      title: "Product not found",
      description: "The product you're looking for could not be found.",
    };
  }

  return {
    title: `${product.name} | Afro Yaca Drum - Boutique en ligne`,
    description: product.description || "Discover our exclusive range of products at Uomo eCommerce.",
  };
}

export default async function ProductDetailsPage({ params }) {
  const productId = params.id;
  const product = await getProduct(productId);

  if (!product) {
    notFound(); // Handle 404 error if the product is not found
  }
  
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <ShopSingleProduct product={product} />
        {/* <RelatedSlider /> */}
      </main>
      <FooterAll />
    </>
  );
}
