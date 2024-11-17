'use client'

import React, {useEffect, useRef, useState} from "react";
import { Loader } from "../common/Loader";
import AddressEditModal from "../modals/AddressEditModal";

export default function EditAddress() {
  const hasFetched = useRef(false);
  const [ userData, setUserData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ modalIsOpen, setModelIsOpen ] = useState(false);
  const [ editAddress, setEditAddress ] = useState({});

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("authToken"));
    
    if (!token){
      window.document.location = "/";
    }
    
    async function getUserAddress() {
      if (hasFetched.current) return; // Avoid re-running
      hasFetched.current = true;
      setLoading(true);
      
      let access_token = token && token.access;

      if (access_token) {
        try {
          let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/get/addresses`, {
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
            if (data){
              setUserData(data);
            } 
            
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch addresses elements list:", error);
          setLoading(false);
        }
      }
      setLoading(false);
    }
    
    getUserAddress();
    setLoading(false);
  }, []);

  const handleUpdateAddress = async (postData) => {
    setLoading(true);

     try {
        let token = JSON.parse(localStorage.getItem("authToken"));
        let access_token = token && token.access;
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/address/update`, {
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
          setLoading(false);
        } else {
          let res_data = await res.json();
          
          if (res_data){
            let data = res_data;
            console.log(data.result)
            setLoading(false);
            setModelIsOpen(false);
            setUserData(data.result);
          }
        }
      } catch (error) {
        console.error("Failed to update user data:", error);
        setLoading(false);
      }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <AddressEditModal setIsModalOpen={setModelIsOpen} isOpen={modalIsOpen} address={editAddress} formSubmit={handleUpdateAddress} />

      <div className="col-lg-9">
        {userData && userData.length > 0 && userData[0].street !== false ? 
          <div className="page-content my-account__address">
            <p className="notice">
              {"Les adresses suivantes seront utilisées par défaut au moment de passer la commande."}
            </p>
            <div className="my-account__address-list">
              {userData.map((elm, id) => (
                <div className="my-account__address-item" key={id}>
                  <div className="my-account__address-item__title">
                    <h5>{`Adresse ${elm.type === 'delivery' ? 'de livraison' : elm.type === 'invoice' ? 'de facturation' : (id + 1)}`}</h5>
                    <a 
                      href="#" 
                      onClick={() => {
                        let addressData = elm;
                        console.log(elm)
                        addressData.add = "update";
                        setEditAddress(addressData);
                        setModelIsOpen(true);
                      }}
                    >{"Modifier"}</a>
                  </div>
                  <div className="my-account__address-item__detail">
                    <p>{elm.partner_name}</p>
                    <p>{elm.street}{elm.street2 && ', ' + elm.street2}{elm.region && ', ' + elm.region}, {elm.city} {elm.zip && elm.zip}</p>
                    <p>{elm.country}</p>
                    <br />
                    <p>{elm.email}</p>
                    <p>{elm.phone}</p>
                  </div>
                </div>
              ))}

              {userData && userData.length == 1 &&
              <div className="my-account__address-item">
                <div className="boutton-wrapper w-100 h-100 text-center">
                  <button 
                    className="btn btn-outline-secondary w-75 h-100 text-uppercase"
                    onClick={() => {
                      if (userData && userData.length > 0){ 
                        let addressData = userData[0];
                        addressData.add = "new";
                        setEditAddress(addressData);
                        setModelIsOpen(true);
                      }
                    }}
                  >
                    + <br />
                    Ajouter une nouvelle addresse
                  </button>
                </div>
              </div>}
              
            </div>
          </div>
          : 
          <div className="page-content my-account__wishlist h-100">
            <div className="fs-18">
            {'Vous n\'avez ajouté aucune adresse pour l\'instant'}
            </div>

            <div className="boutton-wrapper h-100 py-4">
              <button 
                className="btn btn-outline-secondary w-50 h-100 text-uppercase"
                onClick={() => {
                  let value = {
                    add: "new",
                    id: 0,
                    country: "Cameroun"
                  }
                  setEditAddress(value);
                  setModelIsOpen(true);
                }}
              >
                + <br />
                Ajouter une addresse
              </button>
            </div>
          </div>}
      </div>
    </>
  );
}
