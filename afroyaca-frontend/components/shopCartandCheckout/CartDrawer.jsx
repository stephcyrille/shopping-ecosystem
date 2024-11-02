"use client";
import Link from "next/link";

import { useContextElement } from "@/context/Context";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { formatNumber } from "@/utlis/nber_parsing";

export default function CartDrawer() {
  const { cartProducts, setCartProducts, addBackendProductToCart, totalPrice, handleCleanCart } = useContextElement();
  const { currency } = useCurrency();
  const pathname = usePathname();
  const hasFetched = useRef(false);

  useEffect(() => {

    // Reinitialize the cart item list firt before getting the server cart
    if(pathname === '/cart'){
      handleCleanCart();
    }

    async function getCartItems() {
      if (hasFetched.current) return; // Avoid re-running
      hasFetched.current = true;

      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/cart/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' 
        });
        let res_data = await res.json();
        let data = res_data.data;
        let so = data.website_sale_order;

        if (so.order_line.length > 0){
          so.order_line.map((elt) => {
            let item = {
              id: elt.product_id,
              cart_id: so.id,
              line_id: elt.line_id,
              imgAlt: elt.product_name,
              imgSrc: elt.image.image_url,
              price: elt.price_unit,
              title: elt.product_name,
              quantity: elt.product_uom_qty,
            }
            addBackendProductToCart(item);
          });
        } else {
          setCartProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch cart elements list:", error);
      }
    }

    getCartItems();
  }, []);

  const closeCart = () => {
    document
      .getElementById("cartDrawerOverlay")
      .classList.remove("page-overlay_visible");
    document.getElementById("cartDrawer").classList.remove("aside_visible");
  };
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
  useEffect(() => {
    closeCart();
  }, [pathname]);

  return (
    <>
      <div
        className="aside aside_right overflow-hidden cart-drawer "
        id="cartDrawer"
      >
        <div className="aside-header d-flex align-items-center">
          <h3 className="text-uppercase fs-6 mb-0">
            PANIER (
            <span className="cart-amount js-cart-items-count">
              {cartProducts.length}
            </span>{" "}
            )
          </h3>
          <button
            onClick={closeCart}
            className="btn-close-lg js-close-aside btn-close-aside ms-auto"
          ></button>
        </div>
        {cartProducts.length ? (
          <div className="aside-content cart-drawer-items-list">
            {cartProducts.map((elm, i) => (
              <React.Fragment key={i}>
                <div className="cart-drawer-item d-flex position-relative">
                  <div className="position-relative">
                    <Link href={`/shop/single/${elm.id}`}>      
                      <Image
                        loading="lazy"
                        className="cart-drawer-item__img"
                        width={330}
                        height={400}
                        style={{ height: "fit-content" }}
                        loader={() => elm.imgSrc}
                        unoptimized={true}
                        src={elm.imgSrc}
                        alt={elm.imgAlt}
                        />
                    </Link>
                  </div>
                  <div className="cart-drawer-item__info flex-grow-1">
                    <h6 className="cart-drawer-item__title fw-normal">
                      {elm.title}
                    </h6>
                    {/* <p className="cart-drawer-item__option text-secondary">
                      Color: Yellow
                    </p> */}
                    <p className="cart-drawer-item__option text-secondary">
                      Size: {elm.size}
                    </p>
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      <div className="qty-control position-relative">
                        <input
                          type="number"
                          name="quantity"
                          onChange={(e) =>
                            setQuantity(elm, e.target.value / 1)
                          }
                          value={elm.quantity}
                          min="1"
                          className="qty-control__number border-0 text-center"
                        />
                        <div
                          onClick={() => {
                            setQuantity(elm, elm.quantity - 1);
                          }}
                          className="qty-control__reduce text-start"
                        >
                          -
                        </div>
                        <div
                          onClick={() => setQuantity(elm, elm.quantity + 1)}
                          className="qty-control__increase text-end"
                        >
                          +
                        </div>
                      </div>

                      <span className="cart-drawer-item__price money price">
                        {formatNumber(elm.price * elm.quantity)} {currency}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(elm)}
                    className="btn-close-xs position-absolute top-0 end-0 js-cart-item-remove"
                  ></button>
                </div>
                {/* <!-- /.cart-drawer-item d-flex --> */}
                <hr className="cart-drawer-divider" />
              </React.Fragment>
            ))}

            {/* <!-- /.cart-drawer-item d-flex --> */}
          </div>
        ) : (
          <div className="fs-18 mt-5 px-5">
            {'Panier vide. Commencer vos achats!'}
          </div>
        )}
        {/* <!-- /.aside-content --> */}

        <div className="cart-drawer-actions position-absolute start-0 bottom-0 w-100">
          <hr className="cart-drawer-divider" />
          <div className="d-flex justify-content-between">
            <h6 className="fs-base fw-medium">{'SOUS-TOTAL'}:</h6>
            <span className="cart-subtotal fw-medium">{formatNumber(totalPrice)} {currency}</span>
          </div>
          {/* <!-- /.d-flex justify-content-between --> */}
          {cartProducts.length ? (
            <>
              <Link href="/cart" className="btn btn-light mt-3 d-block">
                {'Voir le panier'}
              </Link>
              {/* <Link
                href="/checkout"
                className="btn btn-primary mt-3 d-block"
              >
                {'Validation du panier'}
              </Link> */}
            </>
          ) : (
            <Link href="/shop" className="btn btn-light mt-3 d-block">
              {'Visiter la boutique'}
            </Link>
          )}
        </div>
        {/* <!-- /.aside-content --> */}
      </div>
      <div
        id="cartDrawerOverlay"
        onClick={closeCart}
        className="page-overlay"
      ></div>
    </>
  );
}
