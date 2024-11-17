"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { Loader } from "../common/Loader";

export default function Register() {
  const [errors, setErrors] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
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

  const isValidAge = (birthDate) => {
      // Convert the birthDate string to a Date object
      const birth = new Date(birthDate);
      const today = new Date();
      const minAgeDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
      );

      return birth <= minAgeDate;
  }


  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Le nom est requis.";
    if (!formData.lastName) newErrors.lastName = "Le prénom est requis.";
    if (!formData.birthDate) newErrors.birthDate = "L'année de naissance est requise.";
    else if(!isValidAge(formData.birthDate)) newErrors.birthDate = "L'age minimum pour l'utilisation du site est de 18 ans."
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";
    if (!formData.passwordConfirm) newErrors.passwordConfirm = "La confirmation du mot de passe est requise.";
    if(formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = "Le mot de passe et la confirmation du mot de passe doivent être identique."
    if (!formData.email) newErrors.email = "L'email est requise.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "L'email est invalide.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (validateForm()) {
      console.log('========= SUBMIT =========', formData);
      let postData = {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        birthdate: formData.birthDate,
        first_name: formData.firstName,
        last_name: formData.lastName
      }

      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData),
          credentials: 'include' 
        });

        if (!res.ok){
          let res_data = await res.json();
          let newErrors = {};
          console.log("Not valid >>>>>>>");
          console.log(res_data)
          // errors.submit = res_data.detail;
          // setErrors(errors);
          if (res_data.password) newErrors.password = res_data.password.length > 1 ? res_data.password[0] + ' ' + res_data.password[1] : res_data.password[0]
          if (res_data.username) newErrors.email = res_data.username.length > 1 ? res_data.username[0] + ' ' + res_data.username[1] : res_data.username[0]
          setErrors(newErrors);
          setLoading(false);
        } else {
          let res_data = await res.json();
          
          if (res_data){
            let data = res_data;
            console.log("success=====");
            console.log(data);
            setUserProfile(data.data.email);
            setAccountCreated(true);
            setLoading(false);
            // window.document.location = '/account_dashboard';
          }
        }
      } catch (error) {
        console.error("Failed to register the use:", error);
        setLoading(false);
      }
    

    }

    setLoading(false);
  };

  return (
    <section className="login-register container">
      <Loader isLoading={loading} />
      <div className="tab-content pt-2" id="login_register_tab_content">
        <div className="">
          <h3 className="m-4 pb-4 text-center">{!accountCreated ? "CRÉER UN COMPTE" : "CRÉATION DU COMPTE TERMINÉE"}</h3>
          { !accountCreated ? <div className="register-form">
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
            >
              <div className="form-floating mb-3">
                <input
                  className="form-control form-control_gray"
                  id="lastName"
                  placeholder="Prénom *"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                <label htmlFor="lastName">{"Prénom *"}</label>
                {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control form-control_gray"
                  id="firstName"
                  placeholder="Nom *"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <label htmlFor="firstName">{"Nom *"}</label>
                {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control form-control_gray"
                  type="date"
                  id="birthDate"
                  placeholder="Date de naissance *"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
                <label htmlFor="birthDate">{"Date de naissance *"}</label>
                {errors.birthDate && <small className="text-danger">{errors.birthDate}</small>}
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control form-control_gray"
                  type="email"
                  id="email"
                  placeholder="Email address *"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  {"Connectez-vous."}
                </Link>
              </div>
            </form>
          </div> : 
          <div style={{ textAlign: "justify" }}>
            <p>
              {"Votre compte a été créé avec succès, bien vouloir vous rendre dans votre boite email "}
              <strong>{userProfile}</strong> {"et confirmer votre inscription en \
              cliquant sur le lien dans l'email."}
            </p>
            <p>
              {"Si le lien n'est pas présent dans votre boite email, bien vouloir vérifier dans les Spam."}
            </p>
            <p>{"À bientôt."}</p>

            <Link href="/login" className="btn btn-primary text-uppercase py-3">
              {"Se connecter"}
            </Link>
          </div>
          }
        </div>
      </div>
    </section>
  );
}
