"use client";

import {
  colors,
} from "@/data/products/productFilterOptions";
import { useEffect, useState } from "react";
import Slider from "rc-slider";
import { useCurrency } from "@/context/CurrencyContext";
import { formatNumber } from "@/utlis/nber_parsing";

export default function FilterAll({ onFilterChange, products }) {
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [activeCategory, setActiveCategory] = useState([]);
  const [filterFacts, setFilterFacts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [price, setPrice] = useState([0, 100000]);
  const { currency } = useCurrency();

  useEffect(() => {
    if (products && products.length > 0) {
      let categories = getCategoryCounts(products);
      let values = [];
      categories.map((elt) => {
        let current = {
          name: elt.category,
          label: elt.category,
          total: elt.productCount,
        }
        values.push(current);
      });
      
      setCategoriesList(values);
    }

  }, [])

  useEffect(() => {
    if (typeof onFilterChange === 'function'){
      onFilterChange(activeCategory, activeColor, price);
    }
  }, [activeCategory, activeColor, price]);
  
  const toggleCategories = (category) => {
    if (activeCategory.includes(category)) {
      setActiveCategory((pre) => [...pre.filter((elm) => elm != category)]);
      setFilterFacts((pre) => [
        ...pre.filter((elm) => elm.label != category.name),
      ])
    } else {
      setActiveCategory((pre) => [...pre, category]);
      setFilterFacts((pre) => [
        ...pre,
        { id: (pre.length + 1), label: category.name },
      ])
    }
  };

  const getCategoryCounts = (products) => {
    const categoryCounts = {};
  
    products.forEach(product => {
      const category = product.category;
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });
  
    // Convert the categoryCounts object to an array of category objects
    return Object.keys(categoryCounts).map(categoryName => ({
      category: categoryName,
      productCount: categoryCounts[categoryName]
    }));
  };

  // price range handler
  const handleOnChange = (value) => {
    setPrice(value);
  };

  return (
    <>
      <div className="accordion" id="categories-list">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="accordion-heading-11">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-1"
              aria-expanded="true"
              aria-controls="accordion-filter-1"
            >
              {'Categories d\'articles'}
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path
                    className="svg-path-vertical"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                  <path
                    className="svg-path-horizontal"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-brand"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-brand"
            data-bs-parent="#brand-filters"
          >
            <div className="search-field multi-select accordion-body px-0 pb-0">
              <ul className="multi-select__list list-unstyled">
                {categoriesList && categoriesList.map((elm, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        toggleCategories(elm)}
                      }
                      className={`search-suggestion__item multi-select__item text-primary js-search-select js-multi-select ${
                        activeCategory.includes(elm)
                          ? "mult-select__item_selected"
                          : ""
                      }`}
                    >
                      <span className="me-auto">{elm.name}</span>
                      <span className="text-secondary">{elm.total}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        {/* /.accordion-item */}
      </div>
      
      {/* <div className="accordion" id="color-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header" id="accordion-heading-1">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-2"
              aria-expanded="true"
              aria-controls="accordion-filter-2"
            >
              {'Couleurs'}
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path
                    className="svg-path-vertical"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                  <path
                    className="svg-path-horizontal"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-2"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-1"
            data-bs-parent="#color-filters"
          >
            <div className="accordion-body px-0 pb-0">
              <div className="d-flex flex-wrap">
                {colors.map((swatch, index) => (
                  <a
                    onClick={() => setActiveColor(swatch)}
                    key={index}
                    className={`swatch-color js-filter ${
                      activeColor == swatch ? "swatch_active" : ""
                    }`}
                    style={{ color: swatch.color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}
      
      {/* /.accordion */}
      <div className="accordion" id="price-filters">
        <div className="accordion-item mb-4">
          <h5 className="accordion-header mb-2" id="accordion-heading-price">
            <button
              className="accordion-button p-0 border-0 fs-5 text-uppercase"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#accordion-filter-price"
              aria-expanded="true"
              aria-controls="accordion-filter-price"
            >
              {'Prix'}
              <svg className="accordion-button__icon" viewBox="0 0 14 14">
                <g aria-hidden="true" stroke="none" fillRule="evenodd">
                  <path
                    className="svg-path-vertical"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                  <path
                    className="svg-path-horizontal"
                    d="M14,6 L14,8 L0,8 L0,6 L14,6"
                  />
                </g>
              </svg>
            </button>
          </h5>
          <div
            id="accordion-filter-price"
            className="accordion-collapse collapse show border-0"
            aria-labelledby="accordion-heading-price"
            data-bs-parent="#price-filters"
          >
            <Slider
              style={{ width: "94%"}}
              range
              formatLabel={() => ``}
              max={100000}
              min={0}
              defaultValue={price}
              onChange={(value) => handleOnChange(value)}
              id="slider"
            />
            <div className="price-range__info d-flex align-items-center mt-2">
              <div className="me-auto">
                <span className="text-secondary">Min: </span>
                <span className="price-range__min">{formatNumber(price[0])} {currency} </span>
              </div>
              <div>
                <span className="text-secondary">Max: </span>
                <span className="price-range__max">{formatNumber(price[1])} {currency}</span>
              </div>
            </div>
          </div>
        </div>
        {/* /.accordion-item */}
      </div>
      {/* /.accordion */}
      <div className="filter-active-tags pt-2">
        {filterFacts.map((filter) => (
          <button
            onClick={() =>
              setFilterFacts((pre) => [
                ...pre.filter((elm) => elm.label != filter.label),
              ])
            }
            key={filter.id}
            className="filter-tag d-inline-flex align-items-center mb-3 me-3 text-uppercase js-filter"
          >
            <i className="btn-close-xs d-inline-block" />
            <span className="ms-2">{filter.label}</span>
          </button>
        ))}
        <div></div>
      </div>
    </>
  );
}
