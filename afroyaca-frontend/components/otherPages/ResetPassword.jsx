"use client";

import Link from "next/link";

export default function ResetPassword() {
  return (
    <section className="login-register container">
      <h2 className="section-title text-center fs-3 mb-xl-5">
        {"Réinitialiser le mot de passe".toUpperCase()}
      </h2>
      <p className="mt-4">{"Nous allons vous envoyer un email pour réinitialiser votre mot de passe."}</p>
      <div className="reset-form">
        <form onSubmit={(e) => e.preventDefault()} className="needs-validation">
          <div className="form-floating mb-3">
            <input
              name="login_email"
              type="email"
              className="form-control form-control_gray"
              placeholder="Email address *"
              required
            />
            <label>{"Email *"}</label>
          </div>

          <button
            className="btn btn-primary w-100 text-uppercase"
            type="submit"
          >
            {"Envoyer"}
          </button>

          <div className="customer-option mt-4 text-center">
            <span className="text-secondary">{"Revenir à la page "}</span>
            <Link href="/login" className="btn-text js-show-register">
              {"se connecter"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
