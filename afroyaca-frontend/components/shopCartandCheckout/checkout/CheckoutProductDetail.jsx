import React from 'react'
import { formatNumber } from "@/utlis/nber_parsing";


export const CheckoutProductDetail = ({cartProducts, totalPrice, currency, deliveryMethod}) => {
  return (
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
            <td className="text-end">{deliveryMethod === 'paid' ? `${formatNumber(1500)} ${currency}` : `0 ${currency}`}</td>
          </tr>
          <tr>
            <th>{"TVA"}</th>
            <td className="text-end">{0} {currency}</td>
          </tr>
          <tr>
            <th>{"TOTAL"}</th>
            <td className="text-end">{deliveryMethod === 'paid' ? formatNumber(totalPrice + 1500) : formatNumber(totalPrice)} {currency}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
