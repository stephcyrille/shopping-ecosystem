"use client";
import React from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { languageOptions, socialLinks } from "@/data/footer";

export default function FooterHome() {
  const { currency, changeCurrency } = useCurrency();
  
  const handleCurrencyChange = (e) => {
    changeCurrency(e.target.value);
  };

  return (
    <footer className="footer footer_type_2 bordered">
      <div className="footer-top container pb-5">
        <div className="block-newsletter pb-5 mb-5">
          <h3 className="block__title">{"Inscrivez-vous à notre bulletin d'information"}</h3>
          <p>
            {"Soyez parmis les premiers à recevoir les informations sur les promotions, les tendances et bien plus!"}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="block-newsletter__form"
          >
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder={"Votre addresse email"}
            />
            <button className="btn btn-secondary fw-medium" type="submit">
              {"REJOINDRE"}
            </button>
          </form>
        </div>
        <div className="block-links">
          <ul className="list-unstyled d-flex gap-0 gap-md-5 align-items-center justify-content-center mb-4 flex-column flex-md-row">
            <li className="sub-menu__item">
              <Link href="/terms" className="menu-link menu-link_us-s">
                {"Politique de retour"}
              </Link>
            </li>
            <li className="sub-menu__item">
              <Link
                href="/order_tracking"
                className="menu-link menu-link_us-s"
              >
                {"Suivre votre commande"}
              </Link>
            </li>
            <li className="sub-menu__item">
              <Link href="/about" className="menu-link menu-link_us-s">
                {"A propos de nous"}
              </Link>
            </li>
          </ul>
          <ul className="social-links list-unstyled d-flex flex-wrap align-items-center justify-content-center mb-5">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="footer__social-link d-block" target='_blank'>
                  <svg
                    className={link.className}
                    width={link.width}
                    height={link.height}
                    viewBox={link.viewBox}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {typeof link.icon === "string" ? (
                      <use href={link.icon} />
                    ) : (
                      link.icon
                    )}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* <!-- /.footer-top container --> */}

      <div className="footer-bottom">
        <div className="container d-md-flex align-items-center">
          <span className="footer-copyright me-auto">
            ©{new Date().getFullYear()} Afro Yaca Drum
          </span>
          <div className="footer-settings d-md-flex align-items-center">
            <select
              id="footerSettingsLanguage"
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Default select example"
              name="store-language"
            >
              {languageOptions.map((option, index) => (
                <option
                  key={index}
                  className="footer-select__option"
                  value={option.value}
                >
                  {option.text}
                </option>
              ))}
            </select>

            <select
              id="footerSettingsCurrency"
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Default select example"
              name="store-language"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value={'FCFA'}>FCFA</option>
            </select>
          </div>
          {/* <!-- /.footer-settings --> */}
        </div>
        {/* <!-- /.container d-flex align-items-center --> */}
      </div>
      {/* <!-- /.footer-bottom container --> */}
    </footer>
  );
}
