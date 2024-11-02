"use client";
import React, { useEffect, useState } from "react";
import ProductSlider from "./sliders/ProductSlider";
import BreadCumb from "./BreadCumb";
import Star from "../common/Star";
// import Colors from "./Colors";
import Size from "./Size";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import ShareComponent from "../common/ShareComponent";
import { useContextElement } from "@/context/Context";
import { useCurrency } from "@/context/CurrencyContext";
import { formatNumber } from "@/utlis/nber_parsing";

export default function ShopSingleProduct({ product }) {
  const { cartProducts, setCartProducts } = useContextElement();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const { currency } = useCurrency();

  useEffect(() => {
    if(product.custom_sizes){
      setSelectedSize(product.custom_sizes[0].code);
    }
  }, [product]);

  const isIncludeCard = () => {
    const item = cartProducts.filter((elm) => elm.id == product.id)[0];
    return item;
  };
  const setItemCartQuantity = async (id, quantity) => {
    const item = cartProducts.filter((elm) => elm.id == id)[0];
    if(item){
      if (quantity < 1) return;
      // Send the qty to the backend first
      let postData = {
        line_id: item.line_id,
        product_id: item.id,
        set_qty: quantity,
      };

      try {
        postData.update_methode = "set"
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/cart/update/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData), 
          credentials: 'include' 
        });
        
        let res_data = await res.json();
        let data = res_data.data;
        let new_quantity = data.quantity;

        const items = [...cartProducts];
        const itemIndex = items.indexOf(item);
        // set the qty from server
        item.quantity = new_quantity;
        items[itemIndex] = item;
        setCartProducts(items);
        setQuantity(new_quantity);
      } catch (error) {
        console.error("Failed to fetch cart list:", error);
      }
    }else{
      // Update only the amount of product without posting to the server
      if (quantity < 1) return;
      setQuantity(quantity);
    }
  };


  const addToCart = async (elt, qty) => {
    if (!isIncludeCard()) {
      if (quantity < 1) return;
      let postData = {
        product_id: elt.id,
        add_qty: qty
      }
      
      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/cart/update/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData),
          credentials: 'include' 
        });
        
        let res_data = await res.json();
  
        if (res_data.data.result){
          let data = res_data.data.result;
          let item = {
            id: elt.id,
            cart_id: data.cart_id,
            line_id: data.line_id,
            imgAlt: elt.name,
            imgSrc: elt.image_list[0].image_url,
            price: elt.price,
            title: elt.name,
            quantity: data.quantity,
          }
          setCartProducts((pre) => [...pre, item]);
        } else if (res_data.data.error.data) {
          console.error(res_data.data.error.data.message)
        } else {
          console.log('Another problem', res_data.data)
        }
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }

    } else {
      document
        .getElementById("cartDrawerOverlay")
        .classList.add("page-overlay_visible");
      document.getElementById("cartDrawer").classList.add("aside_visible");
    }
  };

  const handleCheckSize = (value) => {
    setSelectedSize(value);
  };

  return (
    <section className="product-single container">
      <div className="row">
        <div className="col-lg-7">
          <ProductSlider images={product.image_list} />
        </div>
        <div className="col-lg-5">
          <div className="d-flex justify-content-between mb-4 pb-md-2">
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <BreadCumb />
            </div>
            {/* <!-- /.breadcrumb --> */}

            <div className="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
              <a className="text-uppercase fw-medium">
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_prev_md" />
                </svg>
                <span className="menu-link menu-link_us-s">Prev</span>
              </a>
              <a className="text-uppercase fw-medium">
                <span className="menu-link menu-link_us-s">Next</span>
                <svg
                  className="mb-1px"
                  width="10"
                  height="10"
                  viewBox="0 0 25 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_next_md" />
                </svg>
              </a>
            </div>
            {/* <!-- /.shop-acs --> */}
          </div>
          <h1 className="product-single__name">{product.name}</h1>
          <div className="product-single__rating">
            <div className="reviews-group d-flex">
              <Star stars={5} />
            </div>
            <span className="reviews-note text-lowercase text-secondary ms-1">
              {`8k+ commentaires`}
            </span>
          </div>
          <div className="product-single__price">
            <span className="current-price">{formatNumber(product.price)} {currency}</span>
          </div>
          <div className="product-single__short-desc">
            <p>{product.description}</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="product-single__swatches">
              {product.custom_sizes &&
                <div className="product-swatch text-swatches">
                  <label>{'Taille'}</label>
                  <div className="swatch-list">
                    <Size sizeList={product.custom_sizes} onSizeChange={handleCheckSize} />
                  </div>
                  <a
                    href="#"
                    className="sizeguide-link"
                    data-bs-toggle="modal"
                    data-bs-target="#sizeGuide"
                    >
                    {'Guide des tailles'}
                  </a>
                </div>
              }
              {/* <div className="product-swatch color-swatches">
                <label>Color</label>
                <div className="swatch-list">
                  <Colors />
                </div>
              </div> */}
            </div>
            <div className="product-single__addtocart">
              <div className="qty-control position-relative">
                <input
                  type="number"
                  name="quantity"
                  value={isIncludeCard() ? isIncludeCard().quantity : quantity}
                  min="1"
                  onChange={(e) =>
                    setItemCartQuantity(product.id, e.target.value)
                  }
                  className="qty-control__number text-center"
                />
                <div
                  onClick={() =>
                    setItemCartQuantity(
                      product.id,
                      isIncludeCard()?.quantity - 1 || quantity - 1
                    )
                  }
                  className="qty-control__reduce"
                >
                  -
                </div>
                <div
                  onClick={() =>
                    setItemCartQuantity(
                      product.id,
                      isIncludeCard()?.quantity + 1 || quantity + 1
                    )
                  }
                  className="qty-control__increase"
                >
                  +
                </div>
              </div>
              {/* <!-- .qty-control --> */}
              <button
                type="submit"
                className="btn btn-primary btn-addtocart js-open-aside"
                onClick={() => addToCart(product, quantity)}
              >
                {isIncludeCard() ? "Deja ajouté" : "Ajouter au panier"}
              </button>
            </div>
          </form>
          <div className="product-single__addtolinks">
            <a href="#" className="menu-link menu-link_us-s add-to-wishlist">
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_heart" />
              </svg>
              <span>{'Ajouter a la liste d\'envies'}</span>
            </a>
            <ShareComponent title={product.title} />
          </div>
          <div className="product-single__meta-info">
            {product.internal_code &&
              <div className="meta-item">
                <label>{'REF ARTICLE: '}</label>
                <span>{product.internal_code}</span>
              </div>}
            {product.categories &&
              <div className="meta-item">
                <label style={{ marginRight: 5 }}>{'Categories:'}</label>
                <span>{product.categories[0].name}</span>
              </div>}
            {product.tags_list &&
              <div className="meta-item">
                <label style={{ marginRight: 5 }}>Tags:</label>
                <span>biker, black, bomber, leather</span>
              </div>}
          </div>
        </div>
      </div>
      <div className="product-single__details-tab">
        <ul className="nav nav-tabs" id="myTab1" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore active"
              id="tab-description-tab"
              data-bs-toggle="tab"
              href="#tab-description"
              role="tab"
              aria-controls="tab-description"
              aria-selected="true"
            >
              {'Description de l\'article'}
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore"
              id="tab-additional-info-tab"
              data-bs-toggle="tab"
              href="#tab-additional-info"
              role="tab"
              aria-controls="tab-additional-info"
              aria-selected="false"
            >
              {'Information additionnelles'}
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link nav-link_underscore"
              id="tab-reviews-tab"
              data-bs-toggle="tab"
              href="#tab-reviews"
              role="tab"
              aria-controls="tab-reviews"
              aria-selected="false"
            >
              {'Commentaires (2)'}
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="tab-description"
            role="tabpanel"
            aria-labelledby="tab-description-tab"
          >
            {/* Render the rich description HTML from the JSON */}
            <div
              dangerouslySetInnerHTML={{ __html: product.rich_description }}
            />
            {/* <Description /> */}
          </div>
          <div
            className="tab-pane fade"
            id="tab-additional-info"
            role="tabpanel"
            aria-labelledby="tab-additional-info-tab"
          >
            <AdditionalInfo info={product.additional_information} />
          </div>
          <div
            className="tab-pane fade"
            id="tab-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews-tab"
          >
            <Reviews />
          </div>
        </div>
      </div>
    </section>
  );
}
