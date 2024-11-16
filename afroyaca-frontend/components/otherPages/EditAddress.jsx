'use client'

import React, {useEffect, useRef, useState} from "react";
import { Loader } from "../common/Loader";

export default function EditAddress() {
  const [ userData, setUserData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const hasFetched = useRef(false);

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
            
            setUserData(data);
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch addresses elements list:", error);
          setLoading(false);
        }
      }
      setLoading(false);
    }
    
    getUserInfo();
    setLoading(false);
  }, []);

  return (
    <>
      <Loader isLoading={loading} />

      <div className="col-lg-9">
        {userData ? 
          <div className="page-content my-account__address">
            <p className="notice">
              {"Les adresses suivantes seront utilisées par défaut au moment de passer la commande."}
            </p>
            <div className="my-account__address-list">
              {userData.map((elm, id) => (
                <div className="my-account__address-item" key={id}>
                  <div className="my-account__address-item__title">
                    <h5>{`Adresse ${elm.type === 'delivery' ? 'de livraison' : elm.type === 'invoice' ? 'de facturation' : (id + 1)}`}</h5>
                    <a href="#">{"Modifier"}</a>
                  </div>
                  <div className="my-account__address-item__detail">
                    <p>{elm.partner_name}{elm.type !== 'both' && `, ${elm.name}`}</p>
                    <p>{elm.street}{elm.street2 && ', ' + elm.street2}{elm.region && ', ' + elm.region} {elm.zip && elm.zip}</p>
                    <p>{elm.country}</p>
                    <br />
                    <p>{elm.email}</p>
                    <p>{elm.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          : 
          <div className="page-content my-account__wishlist">
            <div className="fs-18">
            {'Vous n\'avez ajouté aucune adresse pour l\'instant'}
            </div>
          </div>}
      </div>
    </>
  );
}
