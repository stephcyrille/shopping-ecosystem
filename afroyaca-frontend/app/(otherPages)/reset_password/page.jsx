import FooterAll from "@/components/footers/FooterAll";
import Header from "@/components/headers/Header";
import ResetPassword from "@/components/otherPages/ResetPassword";
import React from "react";

export const metadata = {
  title: "Reset Password || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <ResetPassword />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <FooterAll />
    </>
  );
}
