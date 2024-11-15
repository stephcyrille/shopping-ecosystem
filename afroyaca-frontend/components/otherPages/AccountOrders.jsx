'use client'

import React, { useEffect, useRef, useState} from "react";
import { Loader } from "../common/Loader";
import { useContextElement } from "@/context/Context";
import { useCurrency } from "@/context/CurrencyContext";
import Pagination2 from "../common/Pagination2";

export default function AccountOrders() {
  const {currency} = useCurrency();
  const [ userData, setUserData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const hasFetched = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  // Calculate the total pages based on the filtered products
  const totalPages = userData && Math.ceil(userData.length / ordersPerPage)

  const paginatedOrders = userData && userData.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("authToken"));
    
    if (!token){
      window.document.location = "/";
    }
    
    async function getUserOrders() {
      if (hasFetched.current) return; // Avoid re-running
      setLoading(true);
      hasFetched.current = true;
      let access_token = token && token.access;

      if (access_token) {
        try {
          let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/get/orders`, {
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
            console.log('==----.../////')
            
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
    
    getUserOrders();
    setLoading(false);
  }, []);


  return (
    <>
      <Loader isLoading={loading} />
      <div className="col-lg-9">
      {userData ? <>
        <div className="page-content my-account__orders-list">
          <table className="orders-table">
            <thead>
              <tr>
                <th>{"REF#"}</th>
                <th>{"Date"}</th>
                <th>{"Total"}</th>
                <th>{"Qté"}</th>
                <th>{"Statut"}</th>
                <th>{"Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((elm, id) => (
                <tr key={id}>
                  <td>#{elm.id}</td>
                  <td>{elm.date_order}</td>
                  <td style={{whiteSpace: "nowrap"}}>{elm.total} {currency}</td>
                  <td>{elm.items}</td>
                  <td> 
                    <span className="badge bg-success">
                      {elm.state === 'sale' ? 'Confirmée' : elm.state}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-primary">VIEW</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination2 
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        </>
        : <div className="page-content my-account__wishlist">
            <div className="fs-18">
            {'Vous n\'avez aucune commande pour l\'instant'}
            </div>
          </div>
        }
      </div> 
    </>
  );
}
