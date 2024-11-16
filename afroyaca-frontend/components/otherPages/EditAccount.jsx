'use client'

import React, {useEffect, useRef, useState} from "react";
import { Loader } from "../common/Loader";

export default function EditAccount() {
  const [ userData, setUserData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const hasFetched = useRef(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("authToken"));
    
    if (!token){
      window.document.location = "/";
    }
    
    async function getUserInfo() {
      if (hasFetched.current) return; // Avoid re-running
      hasFetched.current = true;
      setLoading(true);
      
      let access_token = token && token.access;

      if (access_token) {
        try {
          let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/get/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${access_token}`
            },
            credentials: 'include' 
          });

          if (!res.ok){
            return;
          } else {
            let res_data = await res.json();
            let data = res_data.data;
            console.log('===> ProfilE <======', data)
            setFormData({
              ...formData,
              firstName: data.name,
              lastName: data.name,
              displayName: data.name,
              email: data.email,
            });
            setUserData(data);
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch profile element:", error);
          setLoading(false);
        }
      }
      setLoading(false);
    }
    
    getUserInfo();
    setLoading(false);
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

  return (
    <>
      <Loader isLoading={loading} />
      <div className="col-lg-9">
        <div className="page-content my-account__edit">
          <div className="my-account__edit-form">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="needs-validation"
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      placeholder={"Nom"}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="firstName">{"Nom"}</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      placeholder={"Prénom"}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="lastName">{"Prénom"}</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="displayName"
                      placeholder={"Nom affiché"}
                      value={formData.displayName}
                      onChange={handleInputChange}
                      readOnly
                    />
                    <label htmlFor="displayName">{"Nom affiché"}</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder={"Email"}
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly
                    />
                    <label htmlFor="email">{"Email"}</label>
                  </div>
                </div>
                <div className="col-md-12 text-end">
                  <div className="my-3">
                    <button className="btn btn-primary">{"Mettre à jour"}</button>
                  </div>
                </div>
              </div>
            </form>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="needs-validation"
            >
              <div className="row">
                <div className="col-md-12">
                  <div className="my-3">
                    <h5 className="text-uppercase mb-0">{"Changer le mot de passe"}</h5>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      placeholder={"Mot de passe actuel"}
                      required
                    />
                    <label htmlFor="currentPassword">
                      {"Mot de passe actuel"}
                    </label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder={"Nouveau mot de passe"}
                      required
                    />
                    <label htmlFor="newPassword">{"Nouveau mot de passe"}</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="password"
                      className="form-control"
                      data-cf-pwd="#newPassword"
                      id="confirmPassword"
                      placeholder={"Confirmation du mot de passe"}
                      required
                    />
                    <label htmlFor="confirmPassword">
                      {"Confirmation du mot de passe"}
                    </label>
                    <div className="invalid-feedback">
                      Passwords did not match!
                    </div>
                  </div>
                </div>
                <div className="col-md-12 text-end">
                  <div className="my-3">
                    <button className="btn btn-primary">{"Modifier le mot de passe"}</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
