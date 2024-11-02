"use client";

import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { formatNumber } from "@/utlis/nber_parsing";

export default function Cart() {
  const { cartProducts, setCartProducts, totalPrice, handleDeliveryMethod, handleCheckoutStep } = useContextElement();
  // Save the delivery price
  const { currency } = useCurrency();

  useEffect(() => {
    handleCheckoutStep(1)
  }, []);
  
  const setQuantity = async (elt, quantity, remove=false) => {
    // Send the qty to the backend first
    let postData = {
      line_id: elt.line_id,
      product_id: elt.id,
      set_qty: quantity,
    }

    if (remove){
      try {
        postData.is_delete = true
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/cart/update/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData), // Convert the data to JSON
          credentials: 'include' 
        });
        
        let res_data = await res.json();
        let data = res_data.data;
        let new_quantity = data.quantity;

        const item = cartProducts.filter((elm) => elm.id == elt.id)[0];
        const items = [...cartProducts];
        const itemIndex = items.indexOf(item);
        // set the qty from server
        item.quantity = new_quantity;
        items[itemIndex] = item;
        setCartProducts(items);
      } catch (error) {
        console.error("Failed to fetch cart list:", error);
      }
    } else {
      if (quantity >= 1) {
        try {
          postData.update_methode = "set"
          let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/cart/update/set`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData), // Convert the data to JSON
            credentials: 'include' 
          });
          
          let res_data = await res.json();
          let data = res_data.data;
          let new_quantity = data.quantity;

          const item = cartProducts.filter((elm) => elm.id == elt.id)[0];
          const items = [...cartProducts];
          const itemIndex = items.indexOf(item);
          // set the qty from server
          item.quantity = new_quantity;
          items[itemIndex] = item;
          setCartProducts(items);
        } catch (error) {
          console.error("Failed to fetch cart list:", error);
        }
      }
    }
  };

  const removeItem = async (elt) => {
    await setQuantity(elt, 0, true).then(() => {
      setCartProducts((pre) => [...pre.filter((elm) => elm.id != elt.id)]);
    });
  };

  const [selectedShippingMethod, setSelectedShippingMethod] = useState('paid');

  useEffect(() => {
    handleDeliveryMethod('paid');
  }, []);

  const handleRadioButtonChange = (value) => {
    setSelectedShippingMethod(value);
    handleDeliveryMethod(value);
  };
  return (
    <div className="shopping-cart" style={{ minHeight: "calc(100vh - 300px)" }}>
      <div className="cart-table__wrapper">
        {cartProducts.length ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>{"Produit"}</th>
                  <th></th>
                  <th>{"Prix"}</th>
                  <th>{"Quantité"}</th>
                  <th>{"Sous-total"}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((elm, i) => (
                  <tr key={i}>
                    <td>
                      <Link href={`/shop/single/${elm.id}`}>  
                        <div className="shopping-cart__product-item">
                          <Image
                            loading="lazy"
                            loader={() => elm.imgSrc}
                            unoptimized={true}
                            src={elm.imgSrc}
                            width="120"
                            height="120"
                            alt={elm.imgAlt}
                          />
                        </div>
                      </Link>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{elm.title}</h4>
                        <ul className="shopping-cart__product-item__options">
                          {/* <li>Color: Yellow</li> */}
                          <li>{"Taille"}: {elm.size}</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">
                        {formatNumber(elm.price)} {currency}
                      </span>
                    </td>
                    <td>
                      <div className="qty-control position-relative">
                        <input
                          type="number"
                          name="quantity"
                          value={elm.quantity}
                          min={1}
                          onChange={(e) =>
                            setQuantity(elm, e.target.value / 1)
                          }
                          className="qty-control__number text-center"
                        />
                        <div
                          onClick={() => setQuantity(elm, elm.quantity - 1)}
                          className="qty-control__reduce"
                        >
                          -
                        </div>
                        <div
                          onClick={() => setQuantity(elm, elm.quantity + 1)}
                          className="qty-control__increase"
                        >
                          +
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">
                        {formatNumber(elm.price * elm.quantity)} {currency}
                      </span>
                    </td>
                    <td>
                      <a
                        onClick={() => removeItem(elm)}
                        className="remove-cart"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="#767676"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
                          <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="cart-table-footer">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="position-relative bg-body"
              >
                <input
                  className="form-control"
                  type="text"
                  name="coupon_code"
                  placeholder={"Code du coupon"}
                />
                <input
                  className="btn-link fw-medium position-absolute top-0 end-0 h-100 px-4"
                  type="submit"
                  defaultValue={"APPLIQUER LE COUPON"}
                />
              </form>
              <button className="btn btn-light">{"MISE A JOUR DU PANIER"}</button>
            </div> */}
          </>
        ) : (
          <>
            <div className="fs-20">{"Le panier d'achat est vide"}</div>

            <button className="btn mt-3 btn-light">
              <Link href={"/shop"}>{"Chercher des produits"}</Link>
            </button>
          </>
        )}
      </div>
      {cartProducts.length ? (
        <div className="shopping-cart__totals-wrapper">
          <div className="sticky-content">
            <div className="shopping-cart__totals">
              <h3>{"Montant du panier"}</h3>
              <table className="cart-totals">
                <tbody>
                  <tr>
                    <th>{"Sous-total"}</th>
                    <td>{formatNumber(totalPrice)} {currency}</td>
                  </tr>
                  <tr>
                    <th>{"Livraison"}</th>
                    <td>
                    <div className="form-check">
                      <input
                        className="form-check-input form-check-input_fill"
                        type="radio"
                        name="shipping_method" // Grouping all radio buttons together
                        id="free"
                        disabled={true}
                        checked={selectedShippingMethod === 'free'}
                        onChange={() => handleRadioButtonChange('free')}
                      />
                      <label className="form-check-label" htmlFor="free">
                        {"Livraison gratuite"}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input form-check-input_fill cursor-pointer"
                        type="radio"
                        name="shipping_method" // Grouping all radio buttons together
                        id="paid"
                        checked={selectedShippingMethod === 'paid'}
                        onChange={() => handleRadioButtonChange('paid')}
                      />
                      <label className="form-check-label cursor-pointer" htmlFor="paid">
                        {"Coût standard: 1500"} {currency}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input form-check-input_fill cursor-pointer"
                        type="radio"
                        name="shipping_method" // Grouping all radio buttons together
                        id="pickup"
                        checked={selectedShippingMethod === 'pickup'}
                        onChange={() => handleRadioButtonChange('pickup')}
                      />
                      <label className="form-check-label cursor-pointer" htmlFor="pickup">
                        {"Retrait en magasin"}
                      </label>
                    </div>

                      <div>{"Livraison à 1234 Rue 2.093 Ekié, Yaoundé"}.</div>
                      <div>
                        <a href="#" className="menu-link menu-link_us-s text-gray-400">
                          {"Changer d'adresse"}
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>{"TVA"}</th>
                    <td>{"0"} {currency}</td>
                  </tr>
                  <tr>
                    <th>{"Total"}</th>
                    <td>
                      { selectedShippingMethod === 'paid' ? formatNumber(totalPrice + 1500) : formatNumber(totalPrice) } {currency}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mobile_fixed-btn_wrapper">
              <div className="button-wrapper container">
                <Link
                  onClick={() => handleCheckoutStep(2)}
                  href="/checkout"
                >
                  <button className="btn btn-primary btn-checkout">
                    {"PROCEDER AU PAIEMENT"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
