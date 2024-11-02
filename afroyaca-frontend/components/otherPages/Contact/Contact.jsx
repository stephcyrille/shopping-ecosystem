"use client";

import { storesLocations } from "@/data/storeLocations";

export default function Contact() {
  return (
    <section className="contact-us container">
      <div className="mw-930">
        <div className="row mb-5">
          {storesLocations.slice(0, 1).map((elm, i) => (
            <div key={i} className="col-lg-6">
              <h3 className="mb-4">{"Boutique à"} {elm.city}</h3>
              <p className="mb-4">
                {elm.address}
                <br />
                {elm.country}
              </p>
              <p className="mb-4">
                {elm.emailAddress}
                <br />
                {elm.phone}
              </p>
            </div>
          ))}
        </div>
        <div className="contact-us__form">
          <form
            className="needs-validation"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="mb-5">{"Restez informer"}</h3>
            <div className="form-floating my-4">
              <input
                type="text"
                className="form-control"
                id="contact_us_name"
                placeholder={"Nom *"}
                required
              />
              <label htmlFor="contact_us_name">{"Nom *"}</label>
            </div>
            <div className="form-floating my-4">
              <input
                type="email"
                className="form-control"
                id="contact_us_email"
                placeholder={"Adresse email *"}
                required
              />
              <label htmlFor="contact_us_name">{"Adresse email *"}</label>
            </div>
            <div className="my-4">
              <textarea
                className="form-control form-control_gray"
                placeholder={"Votre message"}
                cols="30"
                rows="8"
                required
              ></textarea>
            </div>
            <div className="my-4">
              <button type="submit" className="btn btn-primary">
                {"Envoyer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
