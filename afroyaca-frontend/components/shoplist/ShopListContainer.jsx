'use client'

import React, { useState, useEffect } from 'react'
import BreadCumb from "./BreadCumb";
import { Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import ColorSelection from "../common/ColorSelection";
import Star from "../common/Star";
import Pagination2 from "../common/Pagination2";
import { Swiper } from "swiper/react";
import ShopListBanner from "./ShopListBanner";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useCurrency } from '@/context/CurrencyContext';
import Image from "next/image";
import { openModalShopFilter } from "@/utlis/aside";
import { sortingOptions } from "@/data/products/productCategories";
import FilterAll from "./filter/FilterAll";
import { formatNumber } from '@/utlis/nber_parsing';

const itemPerRow = [2, 3, 4];

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1000,
};

const spinnerStyle = {
  width: '60px',
  height: '60px',
  border: '5px solid black',
  borderTop: '5px solid red',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;


export default function ShopListContainer() {
  const { toggleWishlist, isAddedtoWishlist, setCartProducts, isAddedToCartProducts } = useContextElement();
  const { currency } = useCurrency();
  const [selectedColView, setSelectedColView] = useState(3);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters states
  const [selectedCategory, setSelectedCategory] = useState([]);  // Catégories sélectionnées
  const [selectedColor, setSelectedColor] = useState(null);      // Couleur sélectionnée
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100000]);  // Plage de prix
  const [filteredProducts, setFilteredProducts] = useState([]);  // Produits filtrés


  useEffect(() => {
    async function fetchProductList() {
        setLoading(true);
        try {
          let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/products/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
          });
          
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          let res_data = await res.json();
          let data = res_data.data.result;
          let products = [];

          if(data.length > 0){
            for(let i = 0; i < data.length; i++){
              let item = {
                id: data[i].id,
                title: data[i].name,
                category: data[i].categories && data[i].categories[0].name,
                price: data[i].price,
                imgSrcList: data[i].image_list.map(elt => elt.image_url),
              };
              if( data[i].rating) {item.rating = data[i].rating}
              if( data[i].reviews) {item.reviews = data[i].reviews}
              if( data[i].discont) {item.discont = data[i].discont}
              if( data[i].priceOld) {item.priceOld = data[i].priceOld}
              if( data[i].isNew) {item.isNew = data[i].isNew}
              if( data[i].colors) {item.colors = data[i].colors}
              products.push(item);
            }

            setProductList(products);
            setFilteredProducts(products);
            setLoading(false);
          }
        } catch (error) {
          console.error("Failed to fetch product list:", error);
          setLoading(false);
        }
    }

    fetchProductList();
}, []);

// Applying filter list in product list
  useEffect(() => {
    let filtered = productList.filter((product) => {
      const categoryMatch = selectedCategory.length === 0 || selectedCategory.some(category => category.name === product.category);
      const colorMatch = !selectedColor || (product.colors && product.colors.includes(selectedColor.color));
      const priceMatch = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1];
      // return categoryMatch && colorMatch && priceMatch;
      return categoryMatch && priceMatch;
    });

    setFilteredProducts(filtered);  // Mettre à jour les produits filtrés
  }, [productList, selectedCategory, selectedColor, selectedPriceRange]);

  // Update filters
  const handleFilterChange = (categories, color, priceRange) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCategory(categories);
      setSelectedColor(color);
      setSelectedPriceRange(priceRange);
      setLoading(false);
    }, 1000);
  };

  const handleAddToCart = async (elt) => {
    setLoading(true);
    if (isAddedToCartProducts(elt.id)){
      
      setTimeout(() => {
        document
          .getElementById("cartDrawerOverlay")
          .classList.add("page-overlay_visible");
        document.getElementById("cartDrawer").classList.add("aside_visible");
        setLoading(false);
      }, 1000);
      return;
    }
    let postData = {
      product_id: elt.id,
      add_qty: 1
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
          imgAlt: elt.title,
          imgSrc: elt.imgSrcList[0],
          price: elt.price,
          title: elt.title,
          quantity: 1,
        }
        setCartProducts((pre) => [...pre, item]);
        document
        .getElementById("cartDrawerOverlay")
        .classList.add("page-overlay_visible");
        document.getElementById("cartDrawer").classList.add("aside_visible");
        
        setLoading(false);
      } else if (res_data.data.error.data) {
        console.error(res_data.data.error.data.message)
        setLoading(false);
      } else {
        console.log('Another problem', res_data.data)
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <>    
    <style>{keyframes}</style>  {/* Keyframes for loader animation */}
      
      {loading && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}></div>
        </div>
      )}
    <section className={`shop-main container d-flex pt-4 pt-xl-5 `}>
      {/* Loader */}
      <div className="shop-sidebar side-sticky bg-body">
        <div
          onClick={openModalShopFilter}
          className="aside-header d-flex d-lg-none align-items-center"
        >
          <h3 className="text-uppercase fs-6 mb-0">{'Filtrer par'}</h3>
          <button className="btn-close-lg js-close-aside btn-close-aside ms-auto"></button>
        </div>

        <div className="pt-4 pt-lg-0"></div>

        {productList.length > 0 && <FilterAll onFilterChange={handleFilterChange} products={productList} />}
      </div>

      <div className="shop-list flex-grow-1">
        <ShopListBanner />
        {/* <!-- /.slideshow --> */}

        <div className="mb-3 pb-2 pb-xl-3"></div>

        <div className="d-flex justify-content-between mb-4 pb-md-2">
          <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
            <BreadCumb />
          </div>
          {/* <!-- /.breadcrumb --> */}

          <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
            <select
              className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0"
              aria-label="Sort Items"
              name="total-number"
            >
              {sortingOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div>

            <div className="col-size align-items-center order-1 d-none d-lg-flex">
              <span className="text-uppercase fw-medium me-2">{'Vues'}</span>
              {itemPerRow.map((elm, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColView(elm)}
                  className={`btn-link fw-medium me-2 js-cols-size ${
                    selectedColView == elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div>
            {/* <!-- /.col-size --> */}

            <div className="shop-filter d-flex align-items-center order-0 order-md-3 d-lg-none">
              <button
                className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                onClick={openModalShopFilter}
              >
                <svg
                  className="d-inline-block align-middle me-2"
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_filter" />
                </svg>
                <span className="text-uppercase fw-medium d-inline-block align-middle">
                  {'Filtre'}
                </span>
              </button>
            </div>
            {/* <!-- /.col-size d-flex align-items-center ms-auto ms-md-3 --> */}
          </div>
          {/* <!-- /.shop-acs --> */}
        </div>
        {/* <!-- /.d-flex justify-content-between --> */}

        <div
          className={`products-grid row row-cols-2 row-cols-md-3  row-cols-lg-${selectedColView}`}
          id="products-grid"
        >
          {filteredProducts.map((elm, i) => (
            <div key={elm.id} className="product-card-wrapper">
              <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                <div className="pc__img-wrapper">
                  <Swiper
                    className="swiper-container background-img js-swiper-slider"
                    slidesPerView={1}
                    modules={[Navigation]}
                    navigation={{
                      prevEl: ".prev3" + i,
                      nextEl: ".next3" + i,
                    }}
                  >
                    {elm.imgSrcList.map((elm2, i) => (
                      <SwiperSlide key={i} className="swiper-slide">
                        <Link href={`/shop/single/${elm.id}`}>
                          <Image
                            loading="lazy"
                            loader={() => elm2}
                            unoptimized={true}
                            src={elm2}
                            width="330"
                            height="400"
                            alt={elm.title}
                            className="pc__img"
                          />
                        </Link>
                      </SwiperSlide>
                    ))}

                    <span
                      className={`cursor-pointer pc__img-prev ${"prev3" + i} `}
                    >
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_prev_sm" />
                      </svg>
                    </span>
                    <span
                      className={`cursor-pointer pc__img-next ${"next3" + i} `}
                    >
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_next_sm" />
                      </svg>
                    </span>
                  </Swiper>
                  <button
                    className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                    onClick={() => handleAddToCart(elm)}
                    title={
                      isAddedToCartProducts(elm.id)
                        ? "Deja ajouté" : "Ajouter au panier"
                    }
                  >
                    {isAddedToCartProducts(elm.id)
                      ? "Deja ajouté" : "Ajouter au panier"}
                  </button>
                </div>

                <div className="pc__info position-relative">
                  <p className="pc__category">{elm.category}</p>
                  <h6 className="pc__title">
                    <Link href={`/shop/single/${elm.id}`}>{elm.title}</Link>
                  </h6>
                  <div className="product-card__price d-flex">
                    {elm.priceOld ? (
                      <>
                        {" "}
                        <span className="money price price-old">
                          {elm.priceOld} {currency}
                        </span>
                        <span className="money price price-sale">
                          {formatNumber(elm.price)} {currency}
                        </span>
                      </>
                    ) : (
                      <span className="money price">{formatNumber(elm.price)} {currency}</span>
                    )}
                  </div>
                  {elm.colors && (
                    <div className="d-flex align-items-center mt-1">
                      {" "}
                      <ColorSelection />{" "}
                    </div>
                  )}
                  {elm.reviews && (
                    <div className="product-card__review d-flex align-items-center">
                      <div className="reviews-group d-flex">
                        <Star stars={elm.rating} />
                      </div>
                      <span className="reviews-note text-lowercase text-secondary ms-1">
                        {elm.reviews}
                      </span>
                    </div>
                  )}

                  <button
                    className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                      isAddedtoWishlist(elm.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(elm.id)}
                    title="Add To Wishlist"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_heart" />
                    </svg>
                  </button>
                </div>
                {elm.discont && (
                  <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__right ms-auto">
                      <span className="pc-label pc-label_sale d-block text-white">
                        -{elm.discont}%
                      </span>
                    </div>
                  </div>
                )}
                {elm.isNew && (
                  <div className="pc-labels position-absolute top-0 start-0 w-100 d-flex justify-content-between">
                    <div className="pc-labels__left">
                      <span className="pc-label pc-label_new d-block bg-white">
                        {'NOUVEAU'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* <!-- /.products-grid row --> */}

        {/* <Pagination2 /> */}
      </div>
    </section>
    </>
  );
}
