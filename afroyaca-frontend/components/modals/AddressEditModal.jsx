import React, {useEffect, useRef, useState} from "react";

export default function AddressEditModal({setIsModalOpen, isOpen, address, formSubmit}) {
  const modalElement = useRef();
  const hasFetched = useRef(false);
  const modalInstance = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    addressType: '',
    street: '',
    state: '',
    city: '',
    phone: '',
    id: '',
    country: "Cameroun",
  });
  const [errors, setErrors] = useState({});
  const [ userEmail, setUserEmail ] = useState("");


  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("authToken"));
    
    if (!token){
      // window.document.location = "/";
      return;
    }

    async function getUserInfo() {
      if (hasFetched.current) return; // Avoid re-running
      hasFetched.current = true;
      let access_token = token && token.access;

      if (access_token) {
        try {
          let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/users/me`, {
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
            let data = res_data;
            setUserEmail(data.username);
          }
        } catch (error) {
          console.error("Failed to fetch cart elements list:", error);
        }
      }
    }
    
    getUserInfo();
  }, [])

  useEffect(() => {
    if (address) {
      if (address.add === "update"){
        setFormData({
          displayName: address.name,
          name: address.type === "delivery" ? address.name + ', Livraison' : address.type === "invoice" ? address.name + ', Facturation' : "",
          addressType: address.type || '',
          street: address.street || '',
          state: address.region || '',
          city: address.city || '',
          phone: address.phone && address.phone.replace(/\s/g, "").replace("+237","") || '',
          id: address.id || '',
          country: "Cameroun",
        });
      } else {
        setFormData({
          displayName: address.name,
          name: 'New',
          addressType: 'delivery',
          street: '',
          state: '',
          city: '',
          phone: '',
          id: address.id || 0,
          country: "Cameroun",
        });
      }
    }
  }, [address]);

  useEffect(() => {
    const bootstrap = require("bootstrap"); // dynamically import bootstrap
    
    // Initialize the modal instance once the modalElement is available
    if (modalElement.current) {
      modalInstance.current = new bootstrap.Modal(modalElement.current, {
        keyboard: false,
      });

      // Add event listener to handle when modal is hidden
      modalElement.current.addEventListener("hidden.bs.modal", () => {
        setIsModalOpen(false); // Set modal state to false when closed
      });
    }

    // Cleanup on unmount
    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, [setIsModalOpen]);

  useEffect(() => {
    if (modalInstance.current) {
      if (isOpen) {
        modalInstance.current.show();
      } else {
        modalInstance.current.hide();
      }
    }
  }, [isOpen]);

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

  const validateForm = () => {
    let newErrors = {};
    if (!formData.street) newErrors.street = "Le nom complet de la rue est requis.";
    if (!formData.city) newErrors.city = "Le nom de la ville est requis.";
    if (!formData.state) newErrors.state = "Choisissez une région.";
    if (!formData.phone) newErrors.phone = "Le numéro de téléphone est requis.";
    else if (!/^\d{9}$/.test(formData.phone)) newErrors.phone = "Le numéro de téléphone doit contenir 9 chiffres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let postData = {
        state: formData.state,
        city: formData.city,
        street: formData.street,
        phone: formData.phone,
        adressType: formData.addressType,
        name: formData.name,
        id: formData.id ? formData.id : 0,
        email: userEmail,
        add: address.add,
      }
      console.log(postData)

      await formSubmit(postData);
    }
  };


  return (
    <div
      className="modal fade"
      id="addressModal"
      tabIndex="-1"
      aria-labelledby="addressModal"
      aria-hidden="true"
      ref={modalElement}
    >
      <div className="modal-dialog delivery-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{formData.displayName}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="delivery-modal__wrapper">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder={"Libéllé de l'addresse *"}
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={address.add === "new" ? false : true}
                    />
                    <label htmlFor="name">{"Libéllé de l'addresse *"}</label>
                    {/* {errors.firstName && <small className="text-danger">{errors.firstName}</small>} */}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating my-3">
                    <select 
                      className="form-control"
                      id="addressType"
                      placeholder={"Type"}
                      value={formData.addressType}
                      onChange={handleInputChange}
                    >
                      <option value="delivery">{"Livraison"}</option>
                      <option value="invoice">{"Facturation"}</option>
                      <option value="both">{"Les deux"}</option>
                    </select>
                    <label htmlFor="addressType">{"Type"}</label>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      placeholder={"Rue 7.124, Nouvelle route Omnisport"}
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="street">{"Rue *"}</label>
                    {errors.street && <small className="text-danger">{errors.street}</small>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      placeholder={"Pays *"}
                      disabled
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="country">{"Pays *"}</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating my-3">
                  <select 
                      className="form-control"
                      id="state"
                      placeholder={"Région *"}
                      value={formData.state}
                      onChange={handleInputChange}
                    >
                      <option value="">{"Choisir..."}</option>
                      <option value="AD">{"Adamaoua"}</option>
                      <option value="CE">{"Centre"}</option>
                      <option value="ES">{"Est"}</option>
                      <option value="EN">{"Extrême-Nord"}</option>
                      <option value="LT">{"Littoral"}</option>
                      <option value="NO">{"Nord"}</option>
                      <option value="NW">{"Nord-Ouest"}</option>
                      <option value="OU">{"Ouest"}</option>
                      <option value="SU">{"Sud"}</option>
                      <option value="SW">{"Sud-Ouest"}</option>
                    </select>
                    <label htmlFor="state">{"Région *"}</label>
                    {errors.state && <small className="text-danger">{errors.state}</small>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder={"Ville *"}
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="city">{"Ville *"}</label>
                    {errors.city && <small className="text-danger">{errors.city}</small>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder={"Numéro de téléphone *"}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="phone">{"Numéro de téléphone *"}</label>
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="my-3">
                  <button className="btn btn-primary">{"Mettre à jour"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- /.modal-dialog --> */}
    </div>
  );
}
