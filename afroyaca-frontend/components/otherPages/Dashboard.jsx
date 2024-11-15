'use client'

import React, {useState, useEffect, useRef} from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { Loader } from "../common/Loader";

export default function Dashboard() {
  const { userToken } = useContextElement();
  const [ userData, setUserData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    setLoading(true);
    let token = JSON.parse(localStorage.getItem("authToken"));

    if (!token){
      window.document.location = "/";
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
            
            console.log('=====>>>>Res data', data)
            setUserData(data);
          }
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch cart elements list:", error);
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
    { userData && 
      <div className="col-lg-9">
        <div className="page-content my-account__dashboard">
          <p>
            {"Salut"} <strong>{userData.username}</strong>
          </p>
          <p>
            {"Dans votre tableau de bord vous pouvez voir "}
            <Link className="unerline-link" href="/account_orders">
              {"vos commandes récentes"}
            </Link>
            {", gérer vos "}
            <Link className="unerline-link" href="/account_edit_address">
              {"Adresses de livraison et de facturation"}
            </Link>
            {", et "}
            <Link className="unerline-link" href="/account_edit">
              {"mettre à jours votre mot de passes et détails du compte."}
            </Link>
          </p>
        </div>
      </div>
    }
    </>
  );
}
