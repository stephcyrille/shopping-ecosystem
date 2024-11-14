"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { Loader } from "../common/Loader";

export default function Register() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: ""
  });

  useEffect(()=>{
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // Clear the error when the user starts editing the field
    if (errors[e.target.id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.id]: null,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); 
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";
    if (!formData.passwordConfirm) newErrors.passwordConfirm = "La confirmation du mot de passe est requise.";
    if(formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = "Le mot de passe et la confirmation du mot de passe doivent être identique."
    if (!formData.email) newErrors.email = "L'email est requise.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "L'email est invalide.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('========= SUBMIT =========', formData)
    }
  };

  return (
    <section className="login-register container">
      <Loader isLoading={loading} />
      <div className="tab-content pt-2" id="login_register_tab_content">
        <div className="">
          <h3 className="m-4 pb-4 text-center">{"CRÉER UN COMPTE"}</h3>
          <div className="register-form">
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
            >
              <div className="form-floating mb-3">
                <input
                  className="form-control form-control_gray"
                  type="email"
                  id="email"
                  placeholder="Email address *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="email">{"Email *"}</label>
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control form-control_gray"
                  id="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="customerPasswodRegisterInput">{"Mot de passe *"}</label>
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <div className="form-floating mb-3">
                <input
                  className="form-control form-control_gray"
                  type="password"
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Password *"
                  required
                />
                <label htmlFor="customerPasswodRegisterInput">{"Confirmation mot de passe *"}</label>
                {errors.passwordConfirm && <small className="text-danger">{errors.passwordConfirm}</small>}
              </div>

              <div className="d-flex align-items-center pb-2">
                <p className="m-0" style={{textAlign: "justify"}}>
                  {"Vos données personnelles vont être utilisés pour améliorer votre \
                  expérience d'utilisation à travers le site, pour gérer votre compte \
                  et pour des raisons supplémentaires que vous trouverez dans notre \
                  politique de confidentialité."}
                </p>
              </div>

              <div className="d-flex align-items-center pb-2">
                <div className="form-check mb-3">
                  <input
                    name="confirmCgv"
                    className="form-check-input form-check-input_fill cursor-pointer"
                    type="checkbox"
                    id={"confirmCgv"}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="confirmCgv" className="form-check-label text-secondary cursor-pointer">
                    {"En cochant vous accepter "} 
                    <Link 
                      href="/terms" 
                      className="btn-text ms-auto"
                      target="_blank"
                      title={"Accéder aux CGV"}
                    >
                      {"les condition générales de vente d'Afro Yaca Drum."}
                    </Link>
                  </label>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 text-uppercase"
                type="submit"
                disabled={!isChecked}
              >
                {"S'inscrire"}
              </button>

              <div className="customer-option mt-4 text-center">
                <span className="text-secondary">{"Vous avez deja un compte ?"}</span>{" "}
                <Link href="/login" className="btn-text">
                  {"Connectez-vous ici."}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
