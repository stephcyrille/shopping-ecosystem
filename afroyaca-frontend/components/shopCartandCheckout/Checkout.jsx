"use client";
import { useContextElement } from "@/context/Context";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useCurrency } from "@/context/CurrencyContext";
import { formatNumber } from "@/utlis/nber_parsing";
import Image from "next/image";
import PaymentModal from "../modals/PaymentModal";

const countries = [
  "Cameroun",
];


export default function Checkout() {
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
  
  useEffect(()=>{
    if(checkoutStep === 1){
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
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis.";
    if (!formData.lastName) newErrors.lastName = "Le nom est requis.";
    if (!formData.email) newErrors.email = "L'email est requise.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "L'email est invalide.";
    if (!formData.phone) newErrors.phone = "Le numéro de téléphone est requis.";
    else if (!/^\d{9}$/.test(formData.phone)) newErrors.phone = "Le numéro de téléphone doit contenir 9 chiffres.";
    if (!formData.address) newErrors.address = "L'adresse est requise.";
    if (!formData.city) newErrors.city = "La ville est requise.";
    if (!formData.zipCode) newErrors.zipCode = "Le code postal est requis.";
    if (!formData.region) newErrors.region = "La région est requise.";
    if (!selectedRegion) newErrors.country = "Veillez choisir un pays dans la liste.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setPhoneConfirmed(false);
      setIsModalOpen(true);
      setFormData({
        ...formData,
        ['phoneConfirmation']: formData.phone,
      });
    }
  };
  
  const validateFormPhoneConfirm = () => {
    let newErrors = {};
    if (!formData.phoneConfirmation) newErrors.phoneConfirmation = "Le numéro de téléphone est requis.";
    else if (!/^\d{9}$/.test(formData.phoneConfirmation)) newErrors.phoneConfirmation = "Le numéro de téléphone doit contenir 9 chiffres.";
    else if (formData.phoneConfirmation !== formData.phone) newErrors.phoneConfirmation = "Le numéro de téléphone doit être identique à celui saisi dans le formulaire.";
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

      let user = null;
      let data = {
        amount : deliveryMethod === 'paid' ? totalPrice + 1500 : totalPrice,
        description : `Afro Yaca Drum Website Paiement ${user ? user.username : 'Public user'} (${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()})`,
        reference : `REF#${cartProducts[0].cart_id}`,
        customer_email : user ? user.email : formData.email,
        customer_name : user ? `${user.firstName} ${user.name}` : `${formData.firstName} ${formData.name}`,
        customer_mobile : user ? `+237${user.phone}` : `+237${formData.phone}`,
        customer_street : user ? user.address : formData.address,
        customer_city : user ? user.city : formData.city,
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

  return (
    <>
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
        />
        <form onSubmit={handleSubmit}>
          <div className="checkout-form">
            <div className="billing-info__wrapper">
              <h4>{"DETAIL DE FACTURATION"}</h4>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="firstName">{"Prénom *"}</label>
                    {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      placeholder="Nom"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="lastName">{"Nom *"}</label>
                    {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="email">{"Email *"}</label>
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="companyName"
                      placeholder={"Nom de la société (optionel)"}
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="companyName">
                      {"Nom de la société (optionel)"}
                    </label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="search-field my-3">
                    <div
                      className={`form-label-fixed hover-container ${
                        idDDActive ? "js-content_visible" : ""
                      }`}
                    >
                      <label htmlFor="search-dropdown" className="form-label">
                        {"Pays *"}
                      </label>
                      <div className="js-hover__open">
                        <input
                          type="text"
                          className="form-control form-control-lg search-field__actor search-field__arrow-down"
                          id="search-dropdown"
                          name="search-keyword"
                          value={selectedRegion}
                          readOnly
                          placeholder={"Choisissez la localisation..."}
                          onClick={() => {
                            errors.country = ""
                            setIdDDActive((pre) => !pre)}
                          }
                        />
                      </div>
                      <div className="filters-container js-hidden-content mt-2">
                        <div className="search-field__input-wrapper">
                          <input
                            type="text"
                            className="search-field__input form-control form-control-sm bg-lighter border-lighter"
                            placeholder="Search"
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                            }}
                          />
                        </div>
                        <ul className="search-suggestion list-unstyled">
                          {countries
                            .filter((elm) =>
                              elm.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((elm, i) => (
                              <li
                                onClick={() => {
                                  setSelectedRegion(elm);
                                  setIdDDActive(false);
                                }}
                                key={i}
                                className="search-suggestion__item js-search-select"
                              >
                                {elm}
                              </li>
                            ))}
                        </ul>
                      </div>
                      {errors.country && <small className="text-danger">{errors.country}</small>}
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating mt-3 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder="Adresse"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="address">{"Adresse *"}</label>
                    {errors.address && <small className="text-danger">{errors.address}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder="Ville"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="city">{"Ville *"}</label>
                    {errors.city && <small className="text-danger">{errors.city}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="zipCode"
                      placeholder="Code postal"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="zipCode">{"Code postal *"}</label>
                    {errors.zipCode && <small className="text-danger">{errors.zipCode}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="region"
                      placeholder="Région (Province)"
                      value={formData.region}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="region">{"Région *"}</label>
                    {errors.region && <small className="text-danger">{errors.region}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="Téléphone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="phone">{"Téléphone (sans l'indicateur regionnal)*"}</label>
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-check mt-3">
                    <input
                      className="form-check-input form-check-input_fill cursor-pointer"
                      type="checkbox"
                      value={"create"}
                      id="create_account"
                      checked={isAccountCreated}  // Bind to state
                      onChange={handleCheckboxChange} 
                    />
                    <label className="form-check-label cursor-pointer" htmlFor="create_account">
                      {"CRÉER UN COMPTE ?"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="checkout__totals-wrapper">
              <div className="sticky-content">
                <div className="checkout__totals">
                  <h3>{"Votre commande".toUpperCase()}</h3>
                  <table className="checkout-cart-items">
                    <thead>
                      <tr>
                        <th>{"PRODUIT"}</th>
                        <th className="text-end">{"SOUS TOTAL"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((elm, i) => (
                        <tr key={i}>
                          <td>
                            {elm.title} x {elm.quantity}
                          </td>
                          <td className="text-end">{formatNumber(elm.price * elm.quantity)} {currency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="checkout-totals">
                    <tbody>
                      <tr>
                        <th>{"SOUS TOTAL"}</th>
                        <td className="text-end">{formatNumber(totalPrice)} {currency}</td>
                      </tr>
                      <tr>
                        <th>{"LIVRAISON"}</th>
                        <td className="text-end">{deliveryMethod === 'paid' ? `${formatNumber(1500)} ${currency}` : `0 ${currency}` }</td>
                      </tr>
                      <tr>
                        <th>{"TVA"}</th>
                        <td className="text-end">{0} {currency}</td>
                      </tr>
                      <tr>
                        <th>{"TOTAL"}</th>
                        <td className="text-end">{ deliveryMethod === 'paid' ? formatNumber(totalPrice + 1500) : formatNumber(totalPrice) } {currency}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="checkout__payment-methods">
                  <h4 className="mb-4">{"Modes de paiement"}</h4>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill cursor-pointer"
                      type="radio"
                      name="checkout_payment_method"
                      id="cm.orange"
                      checked={selectedPaiementMethod === 'cm.orange'}
                      onChange={() => handleRadioButtonChange('cm.orange')}
                    />
                    <label
                      className="form-check-label cursor-pointer"
                      htmlFor="cm.orange"
                    >
                      {"Orange Money CM"}
                      <Image 
                        width={65}
                        height={80}
                        loading="lazy"
                        src={'/assets/images/payment_methods/orange.png'} 
                        className="h-100 w-48 object-fit-cover d-block mt-2 mb-3"
                        alt="image"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill cursor-pointer"
                      type="radio"
                      name="checkout_payment_method"
                      id="cm.mtn"
                      checked={selectedPaiementMethod === 'cm.mtn'}
                      onChange={() => handleRadioButtonChange('cm.mtn')}
                    />
                    <label
                      className="form-check-label cursor-pointer"
                      htmlFor="cm.mtn"
                    >
                      {"MTN Mobile Money CM"}
                      <Image 
                        width={60}
                        height={50}
                        loading="lazy"
                        src={'/assets/images/payment_methods/momo.jpg'} 
                        className="object-fit-cover d-block mt-2 mb-3"
                        alt="image"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </label>
                  </div>
                  {/* <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill cursor-pointer"
                      type="radio"
                      name="checkout_payment_method"
                      id="bank_card"
                      checked={selectedPaiementMethod === 'bank_card'}
                      onChange={() => handleRadioButtonChange('bank_card')}
                    />
                    <label
                      className="form-check-label cursor-pointer"
                      htmlFor="bank_card"
                    >
                      {"Paiement par carte"}
                      <Image 
                        width={60}
                        height={80}
                        loading="lazy"
                        src={'/assets/images/payment_methods/master_card.png'} 
                        className="h-100 w-48 object-fit-cover d-block mt-2 mb-3"
                        alt="image"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input_fill cursor-pointer"
                      type="radio"
                      name="checkout_payment_method"
                      id="paypal"
                      checked={selectedPaiementMethod === 'paypal'}
                      onChange={() => handleRadioButtonChange('paypal')}
                    />
                    <label
                      className="form-check-label cursor-pointer"
                      htmlFor="paypal"
                    >
                      {"Paypal"}
                      <Image 
                        width={60}
                        height={80}
                        loading="lazy"
                        src={'/assets/images/payment_methods/paypal.png'} 
                        className="object-fit-cover d-block"
                        alt="image"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </label>
                  </div> */}
                  <div className="policy-text">
                    Vos données personnelles vont être utilisées pour traiter votre commande, 
                    durant votre expérience à travers le site et pour d'autres raisons décrites dans notre 
                    <Link href="/terms" target="_blank" style={{ marginLeft: "2px" }}>
                      {"politique de confidentialité"}
                    </Link>
                    .
                  </div>
                </div>
                <button className="btn btn-primary btn-checkout" type="submit">
                  {"PLACER VOTRE COMMANDE"}
                </button>
                {Object.keys(errors).length !== 0 && <small className="text-danger text-center d-block pt-2">
                  {"Bien vouloir remplir le formulaire correctement !"}</small>}
              </div>
            </div>
          </div>
        </form>
      </>}
    </>
  );
}
