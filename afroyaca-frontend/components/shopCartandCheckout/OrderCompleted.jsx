"use client";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { formatNumber } from "@/utlis/nber_parsing";

export default function OrderCompleted() {
  const router = useRouter();
  const { paiementMethod, checkoutStep, checkoutData, handleChangeCheckoutData } = useContextElement();
  const [showDate, setShowDate] = useState(false);
  const [paiement, setPaiement] = useState(null);
  const { currency } = useCurrency();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    setShowDate(true);
    // Add overflow: scroll !important to the root <html> element
    document.documentElement.style.setProperty('overflow', 'scroll', 'important');

    if(checkoutStep === 1 || checkoutStep === 2){
      console.log('checkout is number ', checkoutStep, checkoutData)
      router.push('/cart');
    } 

    if (paiementMethod === "cm.orange"){
      setPaiement("Orange Money");
    } else if (paiementMethod === "cm.mtn"){
      setPaiement("MTN Mobile Money");
    } else {
      setPaiement('Autres')
    }

    if(checkoutData) {
      setPageData(checkoutData);
      setTimeout(() => {
        handleChangeCheckoutData(null)
      }, 30000);
      return;
    } else {
      router.push('/');
    }
  }, []);

  return (
    checkoutStep === 3 && 
      <>
        {pageData ? 
          <div className="order-complete text-center">            
            <div className="order-complete__message">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40" cy="40" r="40" fill="#B9A16B" />
                <path
                  d="M52.9743 35.7612C52.9743 35.3426 52.8069 34.9241 52.5056 34.6228L50.2288 32.346C49.9275 32.0446 49.5089 31.8772 49.0904 31.8772C48.6719 31.8772 48.2533 32.0446 47.952 32.346L36.9699 43.3449L32.048 38.4062C31.7467 38.1049 31.3281 37.9375 30.9096 37.9375C30.4911 37.9375 30.0725 38.1049 29.7712 38.4062L27.4944 40.683C27.1931 40.9844 27.0257 41.4029 27.0257 41.8214C27.0257 42.24 27.1931 42.6585 27.4944 42.9598L33.5547 49.0201L35.8315 51.2969C36.1328 51.5982 36.5513 51.7656 36.9699 51.7656C37.3884 51.7656 37.8069 51.5982 38.1083 51.2969L40.385 49.0201L52.5056 36.8996C52.8069 36.5982 52.9743 36.1797 52.9743 35.7612Z"
                  fill="white"
                />
              </svg>
              <h3>{"Votre commande est complète !"}</h3>
              <p>{"Merci. Votre commande à bien été reçue."}</p>
            </div>
            <div className="order-info">
              <div className="order-info__item">
                <label>{"Commande N"}</label>
                <span>{`REF#${pageData.website_sale_order.id}`}</span>
              </div>
              <div className="order-info__item">
                <label>{"Date"}</label>
                {showDate && <span>{new Date().toLocaleDateString()}</span>}
              </div>
              <div className="order-info__item">
                <label>{"Total"}</label>

                <span>{formatNumber(pageData.amount_total)} {currency}</span>
              </div>
              <div className="order-info__item">
                <label>{"Méthode de paiement"}</label>
                <span>{paiement}</span>
              </div>
            </div>
            <div className="checkout__totals-wrapper">
              <div className="checkout__totals">
                <h3>{"Détail de la commande".toUpperCase()}</h3>
                <table className="checkout-cart-items">
                  <thead>
                    <tr>
                      <th className='text-start'>{"PRODUITS"}</th>
                      <th>{"SOUS TOTAL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.website_sale_order.order_line.map((elm, i) => (
                      <tr key={i}>
                        <td className='text-start'>
                          {elm.product_name} x {elm.product_uom_qty}
                        </td>
                        <td className='text-end'>{formatNumber(elm.price_subtotal)} {currency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="checkout-totals">
                  <tbody>
                    <tr>
                      <th className='text-start'>{"SOUS TOTAL"}</th>
                      <td className='text-end'>{formatNumber(pageData.amount_total - pageData.delivery_fee)} {currency}</td>
                    </tr>
                    <tr>
                      <th className='text-start'>{"LIVRAISON"}</th>
                      <td className='text-end'>{formatNumber(pageData.delivery_fee)} {currency}</td>
                    </tr>
                    <tr>
                      <th className='text-start'>{"TVA"}</th>
                      <td className='text-end'>{formatNumber(0)} {currency}</td>
                    </tr>
                    <tr>
                      <th className='text-start'>{"TOTAL"}</th>
                      <td className='text-end'>{formatNumber(pageData.amount_total)} {currency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Link className="btn btn-primary btn-checkout" href={'/'}>
                {"ALLER A L'ACCUEIL"}
              </Link>
            </div>
          </div>
          : '' } 
      </>
        
  );
}
