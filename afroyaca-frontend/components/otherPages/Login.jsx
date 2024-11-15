"use client";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Loader } from "../common/Loader";
import { useContextElement } from "@/context/Context";

export default function Login() {
  const router = useRouter();
  const {handleSetUserToken} = useContextElement();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  useEffect(()=>{
    // setLoading(true);

    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000)
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      submit: null,
    }));

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
        password: formData.password
      }

      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/jwt/create/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData),
          credentials: 'include' 
        });

        if (!res.ok){
          let res_data = await res.json();
          let errors = {};
          errors.submit = res_data.detail;
          setErrors(errors);
          setLoading(false);
        } else {
          let res_data = await res.json();
          
          if (res_data){
            let data = res_data;
            let tokens = {
              access: data.access,
              refresh: data.refresh,
            }
            handleSetUserToken(tokens);
            setLoading(false);
            window.document.location = '/account_dashboard';
          }
        }
      } catch (error) {
        console.error("Failed to login the use:", error);
        setLoading(false);
      }
    }
  };

  return (
    <section className="login-register container">
      <Loader isLoading={loading} />
      <div className="tab-content pt-2" id="login_register_tab_content">
        <div className="">
          <h3 className="m-4 pb-4 text-center">{"SE CONNECTER"}</h3>
          <div className="login-form">
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
            >
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control form-control_gray"
                  placeholder="Email *"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="email">{"Email *"}</label>
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="pb-3"></div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control form-control_gray"
                  id="password"
                  placeholder="Mot de passe *"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">{"Mot de passe *"}</label>
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <div className="d-flex align-items-center mb-3 pb-2">
                <div className="form-check mb-0">
                  <input
                    name="remember"
                    className="form-check-input form-check-input_fill cursor-pointer"
                    type="checkbox"
                    id={"rememberMe"}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="rememberMe" className="form-check-label text-secondary cursor-pointer">
                    {"Se souvenir de moi"}
                  </label>
                </div>
                <Link href="/reset_password" className="btn-text ms-auto">
                  {"Mot de passe oublié ?"}
                </Link>
              </div>

              <button
                className="btn btn-primary w-100 text-uppercase"
                type="submit"
              >
                {"Se connecter"}
              </button>
              <span className="m-2" style={{ display: "block", textAlign: "center" }}>{errors.submit && <small className="text-danger">{errors.submit}</small>}</span>

              <div className="customer-option mt-4 text-center">
                <span className="text-secondary">{"Pas encore inscrit ?"}</span>{" "}
                <Link href="/register" className="btn-text">
                  {"Créer un compte"}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
