"use client";
import { useContextElement } from "@/context/Context";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useCurrency } from "@/context/CurrencyContext";
import PaymentModal from "../modals/PaymentModal";
import { Loader } from "../common/Loader";
import { CheckoutFormUser } from "./checkout/CheckoutFormUser";
import { CheckoutProductDetail } from "./checkout/CheckoutProductDetail";
import { CheckoutPaiementSelect } from "./checkout/CheckoutPaiementSelect";
import AddressEditModal from "../modals/AddressEditModal";

const countries = [
  "Cameroun",
];


export default function   Checkout() {
  const router = useRouter();
  const { cartProducts, totalPrice, deliveryMethod, handleDeliveryMethod,
    paiementMethod, handlePaiementMethod, setCartProducts,
    checkoutStep, handleCheckoutStep, handleChangeCheckoutData } = useContextElement();
  const [selectedRegion, setSelectedRegion] = useState("Cameroun");
  const [idDDActive, setIdDDActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ussdConfirm, setUssdConfirm] = useState("");
  const { currency } = useCurrency();
  const [selectedPaiementMethod, setSelectedPaiementMethod] = useState('cm.orange');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    region: "",
    companyName: "",
    phoneConfirmation: ""
  });
  const [errors, setErrors] = useState({});
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trxRef, setTrxRef] = useState('');
  const hasFetched = useRef(false);
  const [ userData, setUserData ] = useState(null);
  const refs = useRef([]); // Create a ref array for all elements
  const [ selectedAddress, setSelectedAddress ] = useState(null);
  const [ modalIsOpen, setModelIsOpen ] = useState(false);
  const [ editAddress, setEditAddress ] = useState({});
  const [ isConnected, setIsConnected ] = useState(false);

  const handleMouseEnter = (index) => {
    const element = refs.current[index];
    if (element) {
      element.style.transform = 'scale(1.02)';
      element.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      element.style.transition = 'transform 0.3s, box-shadow 0.3s';
    }
  };

  const handleMouseLeave = (index) => {
    const element = refs.current[index];
    if (element) {
      element.style.transform = 'scale(1)';
      element.style.boxShadow = 'none';
    }
  };

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("authToken"));
    
    if (!token){
      setIsConnected(false);
    }
    
    async function getUserAddress() {
      if (hasFetched.current) return; // Avoid re-running
      hasFetched.current = true;
      setLoading(true);
      
      let access_token = token && token.access;

      if (access_token) {
        setIsConnected(true);
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

  useEffect(()=>{
    if(checkoutStep === 1 || checkoutStep === 0){
      router.push('/cart');
    } else if (checkoutStep === 3){
      router.push('/cart');
    }
  }, []);

  useEffect(() => {
    if (paiementMethod !== null){
      setSelectedPaiementMethod(paiementMethod);
    } else {
      handleRadioButtonChange('cm.orange');
    }
  }, [paiementMethod]);

  const handleCheckboxChange = (e) => {
    setIsAccountCreated(e.target.checked);
  };


  const handleRadioButtonChange = (value) => {
    setSelectedPaiementMethod(value);
    handlePaiementMethod(value);
  };

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

  const validateForm = () => {
    let newErrors = {};
    if (!selectedAddress) newErrors.address = "Veuillez cliquer sur l'addresse de livraison.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setPhoneConfirmed(false);
      setIsModalOpen(true);
      if (selectedAddress) {
        setFormData({
          ...formData,
          ['phoneConfirmation']: selectedAddress.phone,
        });
        console.log("Slected ====>>", selectedAddress);
      } else {
        console.log("No selected address ====>>");
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        global: "Bien vouloir remplir le formulaire correctement !",
      }));
    }
  };
  
  const validateFormPhoneConfirm = () => {
    let newErrors = {};
    if (!formData.phoneConfirmation) newErrors.phoneConfirmation = "Le numéro de téléphone est requis.";
    else if (!/^\d{9}$/.test(formData.phoneConfirmation)) newErrors.phoneConfirmation = "Le numéro de téléphone doit contenir 9 chiffres.";
    else if (formData.phoneConfirmation !== selectedAddress.phone) newErrors.phoneConfirmation = "Le numéro de téléphone doit être identique à celui de l'adresse sélectionnée.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedPayment = async () => {
    if(cartProducts.length < 1){
      console.error("The length of the cart must be grater than or equal to 1")
      return ;
    }

    if (validateFormPhoneConfirm()) {
      setPhoneConfirmed(true);
      setIsLoading(true);

      let data = {
        amount : deliveryMethod === 'paid' ? totalPrice + 1500 : totalPrice,
        description : `Afro Yaca Drum Website Paiement ${selectedAddress && `${selectedAddress.firstname} ${selectedAddress.lastname}`} (${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()})`,
        reference : `REF#${cartProducts[0].cart_id}`,
        customer_email : selectedAddress && selectedAddress.email,
        customer_name : selectedAddress && `${selectedAddress.firstname} ${selectedAddress.lastname}`,
        customer_mobile : formData.phoneConfirmation && `+237${formData.phoneConfirmation}`,
        customer_street : selectedAddress && selectedAddress.street,
        customer_city : selectedAddress && selectedAddress.city,
        channel : paiementMethod,
        delivery_fee : deliveryMethod === 'paid' ? 1500 : 0,
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        const response = await fetch(`${baseUrl}/apis/payments/init`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(data), // Convert the data to JSON
        });
    
        if (!response.ok) {
          // Handle HTTP errors
          const error = await response.json();
          console.log("List of err", error)
          setServerMsg(error);
          throw new Error(error.message || "Something went wrong");
        }
    
        const result = await response.json();
        
        if(result.code === 400){
          setServerMsg(result);
        } else {
          if (result.weather === 0) {
            setServerMsg(null);
            handleChangeCheckoutData(result.data)
            setCartProducts([]);
            handlePaiementMethod(null);
            handleDeliveryMethod(null);
            handleCheckoutStep(3);
            router.replace('/order_complete');
          } else if (result.weather === 1){
            setServerMsg(null);
            setTrxRef(result.reference);
            setUssdConfirm(result.message);
          } else {
            console.warn('No state prepare for this behavious')
          }
        }
        setIsLoading(false);
        return result; // Return the result or handle it as needed
      } catch (error) {
        console.error("Payment failed:", error);
        setIsLoading(false);
      }
      
    } else {
      console.log("NOOOOOOOOOO Valid form");
    }
  };

  const handleConfirmUssdPayment = async () => {
    setLoading(true);
    setServerMsg(null)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(`${baseUrl}/apis/payment/check?reference=${trxRef}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        // Handle HTTP errors
        const error = await response.json();
        console.log("List of err", error)
        throw new Error(error.message || "Something went wrong");
      }
  
      const result = await response.json();
      
      if (result.data.status === 'complete'){
        setServerMsg(null);
        handleChangeCheckoutData(result.data)
        setCartProducts([]);
        handlePaiementMethod(null);
        handleDeliveryMethod(null);
        handleCheckoutStep(3);
        setLoading(false);
        router.replace('/order_complete');
      } else {
        setLoading(false);
        let msg = {
          errorMessage: `Le statut du paiement est ${result.data.status}.`,
          message: "Bien vouloir fermer ce block (sans fermer la fenetre) et procéder de nouveau  \
                    au paiement.",
        }
        setServerMsg(msg);
      }

    } catch (error) {
      console.error("Payment check failed:", error);
      setLoading(false);
    }
  };

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
            setLoading(false);
            setModelIsOpen(false);
            setUserData(data.result);
          }
        }
      } catch (error) {
        console.error("Failed to update user data:", error);
        setLoading(false);
      }
  }

  return (
    <>
      <Loader isLoading={loading} />

      <AddressEditModal 
        setIsModalOpen={setModelIsOpen} 
        isOpen={modalIsOpen} 
        address={editAddress} 
        formSubmit={handleUpdateAddress} 
      />
      {checkoutStep === 2 && <>
        <PaymentModal 
          isOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          handleProceedPayment={handleProceedPayment} 
          phoneNumberIsConfirmed={phoneConfirmed}
          phoneInput={formData.phoneConfirmation}
          errMsg={errors.phoneConfirmation}
          handleInputChange={handleInputChange} 
          isLoading={isLoading}
          paymentErrors={serverMsg}
          ussdMsg={ussdConfirm}
          handleCheckPaiement={handleConfirmUssdPayment}
        />

          <form onSubmit={handleSubmit}>
            <div className="checkout-form">
              <div className="billing-info__wrapper">
                <Link href={"/cart"} className="btn btn-link mb-4">{"< Revenir au panier"}</Link>
                {userData && userData.length > 0 ? <h4 className="my-3">{"Sélectionner l'addresse de livraison"}</h4> : isConnected ? <h4>{"LIVRAISON & FACTURATION"}</h4> : ''}
                
                {isConnected ? <>  
                  {userData && userData.length > 0 ? 
                  userData.map((elm, id) => (
                    <div 
                      className={`my-account__address-item border ${selectedAddress && selectedAddress.id === elm.id && 'border-secondary border-2'} mb-4 p-4 cursor-pointer`} 
                      key={id}
                      ref={(el) => (refs.current[id] = el)} // Assign each element to the ref array
                      onMouseEnter={() => handleMouseEnter(id)}
                      onMouseLeave={() => handleMouseLeave(id)}
                    >
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
                      <div 
                        className="my-account__address-item__detail"
                        onClick={() => {
                          let newErrors = {};
                          newErrors.address = ''
                          setErrors(newErrors);
                          setSelectedAddress(elm);
                        }}
                      >
                        <p>{elm.partner_name}</p>
                        <p>{elm.street}{elm.street2 && ', ' + elm.street2}{elm.region && ', ' + elm.region}, {elm.city} {elm.zip && elm.zip}</p>
                        <p>{elm.country}</p>
                        <br />
                        <p>{elm.email}</p>
                        <p>{elm.phone}</p>
                      </div>
                    </div>
                  ))
                  :
                  <div className="page-content my-account__wishlist h-50">
                    <div className="fs-18">
                    {'Vous n\'avez ajouté aucune adresse pour l\'instant'}
                    </div>

                    <div className="boutton-wrapper h-50 py-4">
                      <button 
                        className="btn btn-outline-secondary w-100 h-100 text-uppercase"
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
                  </div>
                  // <CheckoutFormUser 
                  // formData={formData}
                  // handleInputChange={handleInputChange}
                  // errors={errors}
                  // idDDActive={idDDActive}
                  // selectedRegion={selectedRegion}
                  // setIdDDActive={setIdDDActive}
                  // setSearchQuery={setSearchQuery}
                  // countries={countries}
                  // isAccountCreated={isAccountCreated}
                  // handleCheckboxChange={handleCheckboxChange}
                  // searchQuery={searchQuery}
                  // setSelectedRegion={setSelectedRegion}
                  // />
                  }
                {errors.address && <small className="text-danger text-start d-block pt-2">
                  {errors.address}</small>}
                </> : 
                <div className="my-4 text-center">
                  <svg
                    className="d-block w-100 text-center"
                    width="80"
                    height="80"
                    viewBox="0 0 20 20"
                    fill="#000000"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="#icon_user" />
                  </svg>

                  <h5 className="pt-4">{"Vous devez être connecter pour passer une commande."}</h5>
                  <Link className="btn btn-outline-dark rounded my-3" href={"/login?next=/checkout"}>{"Se connecter"}</Link>
                </div>}
              </div>

              <div className="checkout__totals-wrapper">
                <div className="sticky-content">
                  <CheckoutProductDetail 
                    cartProducts={cartProducts}
                    totalPrice={totalPrice}
                    currency={currency}
                    deliveryMethod={deliveryMethod}
                  />
                  {isConnected && <>
                    <CheckoutPaiementSelect 
                      selectedPaiementMethod={selectedPaiementMethod}
                      handleRadioButtonChange={handleRadioButtonChange}
                    />
                    <button className="btn btn-primary btn-checkout" type="submit">
                      {"PLACER VOTRE COMMANDE"}
                    </button>
                    {errors.global && <small className="text-danger text-center d-block pt-2">
                      {errors.global}</small>}
                  </>}
                </div>
              </div>
            </div>
          </form>
          
      </>}
    </>
  );
}
