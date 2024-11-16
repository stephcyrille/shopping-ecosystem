'use client'

import React, {useEffect, useRef, useState} from "react";
import { Loader } from "../common/Loader";

export default function EditAccount() {
  const [ userData, setUserData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ isUpdated, setIsUpdated ] = useState(false);
  const hasFetched = useRef(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    id: null,
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
            setFormData({
              ...formData,
              firstName: data.firstname || '',
              lastName: data.lastname || '',
              displayName: data.name || '',
              email: data.email || '',
              id: data.id,
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

    setIsUpdated(false);

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

  const validateProfileForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Le nom est requis.";
    if (!formData.lastName) newErrors.lastName = "Le prénom est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    let newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = "Le mot de passe actuel est requis.";
    if (!formData.newPassword) newErrors.newPassword = "Le nouveau mot de passe est requis.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "La confirmation du mot de passe est requise.";
    else if (formData.confirmPassword !== formData.newPassword) newErrors.confirmPassword = "La confirmation du mot de passe doit être identique au nouveau mot de passe.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProfile = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (validateProfileForm()) {
      let postData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        id: formData.id
      }

      try {
        let token = JSON.parse(localStorage.getItem("authToken"));
        let access_token = token && token.access;
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/profile/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${access_token}`
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
            setFormData({
              ...formData,
              displayName: data.name,
            });
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to update user data:", error);
        setLoading(false);
      }
    }
  };

  const handleSubmitPasswordUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (validatePasswordForm()) {
      let postData = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        re_new_password: formData.confirmPassword,
      }

      try {
        let token = JSON.parse(localStorage.getItem("authToken"));
        let access_token = token && token.access;
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/users/set_password/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${access_token}`
          },
          body: JSON.stringify(postData),
          credentials: 'include' 
        });

        if (!res.ok){
          let res_data = await res.json();
          let newErrors = {};
          if (res_data.current_password) newErrors.currentPassword = res_data.current_password[0]
          if (res_data.new_password) newErrors.newPassword = res_data.new_password.length > 1 ? res_data.new_password[0] + ' and ' + res_data.new_password[1] : res_data.new_password[0]
          setErrors(newErrors);
          setLoading(false);
        } else {
          setFormData({
            ...formData,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setIsUpdated(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to update user password:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <div className="col-lg-9">
        <div className="page-content my-account__edit">
          <div className="my-account__edit-form">
            <form
              onSubmit={handleSubmitProfile}
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
                    />
                    <label htmlFor="firstName">{"Nom"}</label>
                    {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
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
                    />
                    <label htmlFor="lastName">{"Prénom"}</label>
                    {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
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
              onSubmit={handleSubmitPasswordUpdate}
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
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="currentPassword">{"Mot de passe actuel"}</label>
                    {errors.currentPassword && <small className="text-danger">{errors.currentPassword}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder={"Nouveau mot de passe"}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="newPassword">{"Nouveau mot de passe"}</label>
                    {errors.newPassword && <small className="text-danger">{errors.newPassword}</small>}
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
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="confirmPassword">{"Confirmation du mot de passe"}</label>
                    {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                  </div>
                </div>
                <div className="col-md-12 text-end">
                  <div className="my-3">
                    <button 
                      className="btn btn-primary"
                      disabled={isUpdated}
                    >
                      {isUpdated ? "Mot de passe mis à jour !" : "Modifier le mot de passe"}
                    </button>
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
