import React from 'react'
import Link from "next/link";
import Image from "next/image";


export const CheckoutPaiementSelect = ({selectedPaiementMethod, handleRadioButtonChange}) => {
  return (
    <div className="checkout__payment-methods">
      <h4 className="mb-4">{"Modes de paiement"}</h4>
      <div className="form-check">
        <input
          className="form-check-input form-check-input_fill cursor-pointer"
          type="radio"
          name="checkout_payment_method"
          id="cm.orange"
          checked={selectedPaiementMethod === 'cm.orange'}
          onChange={() => handleRadioButtonChange('cm.orange')} />
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
            style={{ width: 'auto', height: 'auto' }} />
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input form-check-input_fill cursor-pointer"
          type="radio"
          name="checkout_payment_method"
          id="cm.mtn"
          checked={selectedPaiementMethod === 'cm.mtn'}
          onChange={() => handleRadioButtonChange('cm.mtn')} />
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
            style={{ width: 'auto', height: 'auto' }} />
        </label>
      </div>

      <div className="policy-text">
        {"Vos données personnelles vont être utilisées pour traiter votre commande, durant \
                    votre expérience à travers le site et pour d'autres raisons décrites dans notre "}
        <Link href="/terms" target="_blank" style={{ marginLeft: "2px" }}>
          {"politique de confidentialité"}.
        </Link>
      </div>
    </div>
  )
}
