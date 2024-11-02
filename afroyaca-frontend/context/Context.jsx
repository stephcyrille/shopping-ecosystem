"use client";
import { allProducts } from "@/data/products";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paiementMethod, setPaiementMethod] = useState("cm.orange");
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const addBackendProductToCart = (item) => {
    setCartProducts((prevCartProducts) => {
      if (!prevCartProducts.find((elm) => elm.id === item.id)) {
        return [...prevCartProducts, item];
      }
      return prevCartProducts;
    });
  };

  const addProductToCart = (id) => {
    if (!cartProducts.filter((elm) => elm.id == id)[0]) {
      const item = {
        ...allProducts.filter((elm) => elm.id == id)[0],
        quantity: 1,
      };
      setCartProducts((pre) => [...pre, item]);

      document
        .getElementById("cartDrawerOverlay")
        .classList.add("page-overlay_visible");
      document.getElementById("cartDrawer").classList.add("aside_visible");
    }
  };
  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const toggleWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    } else {
      setWishList((pre) => [...pre, id]);
    }
  };
  const isAddedtoWishlist = (id) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const handleCleanCart = () => {
    localStorage.setItem("cartList", JSON.stringify([]));
  }

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);
  
  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem("deliveryMethod"));
    if (delivery !== "") {
      setDeliveryMethod(delivery);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("deliveryMethod", JSON.stringify(deliveryMethod));
  }, [deliveryMethod]);
  
  const handleDeliveryMethod = (method) => {
    setDeliveryMethod(method)
  }

  useEffect(() => {
    const paiement = JSON.parse(localStorage.getItem("paiementMethod"));
    if (paiement !== "") {
      setPaiementMethod(paiement);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("paiementMethod", JSON.stringify(paiementMethod));
  }, [paiementMethod]);
  const handlePaiementMethod = (method) => {
    setPaiementMethod(method)
  }

  useEffect(() => {
    const myCheckoutStep = JSON.parse(localStorage.getItem("checkoutStep"));
    if (myCheckoutStep !== null) {
      setCheckoutStep(myCheckoutStep);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("checkoutStep", JSON.stringify(checkoutStep));
  }, [checkoutStep]);
  const handleCheckoutStep = (step) => {
    setCheckoutStep(step)
  }

  useEffect(() => {
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    if (checkoutData !== "" || checkoutData !== null) {
      setPaiementMethod(checkoutData);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  }, [checkoutData]);
  const handleChangeCheckoutData = (data) => {
    setCheckoutData(data)
  }

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    handleCleanCart,
    toggleWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    deliveryMethod,
    handleDeliveryMethod,
    paiementMethod,
    handlePaiementMethod,
    addBackendProductToCart,
    checkoutStep,
    handleCheckoutStep,
    checkoutData,
    handleChangeCheckoutData
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
