'use client'

import React, { useState, useEffect } from 'react'
import Link from "next/link";
import Image from "next/image";
import { Loader } from '../common/Loader';

export default function CategoryMassonry() {
  const [collectionList, setCollectionList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    async function fetchHomeCollectionList() {
      try{
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/home/collections`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        let res_data = await res.json();
        let data = res_data.data.result;


        if(data.length > 0){
          setCollectionList(data);
          setLoading(false);
        }
      } catch (error) {
          console.error("Failed to fetch collections:", error);
          setLoading(false);
      }
    }
    fetchHomeCollectionList();
  }, [])

  return (
    <>
      <Loader isLoading={loading} />
      <section className="category-masonry container">
        <div className="row">
          <div className="col-lg-6 px-4">
            <div className="category-masonry__item">
              <h2 className="category-masonry__title fw-normal mb-0">
                {"Nouvelle collection"}
                <br />
                {"Et tendances"}
              </h2>
            </div>
            <div className="pb-4 mb-4 pb-xl-5 mb-xl-5"></div>
            {collectionList.length > 0 && 
              <>
                { collectionList[0] && <div className="category-masonry__item">
                  <div className="category-masonry__item-image pb-1 mb-4">
                    <Image
                      loading="lazy"
                      className="h-auto"
                      loader={() => collectionList[0].picture}
                      unoptimized={true}
                      src={collectionList[0].picture}
                      width="570"
                      height="500"
                      alt={collectionList[0].title}
                      />
                  </div>
                  <h2>{collectionList[0].title}</h2>
                  <Link
                    href={collectionList[0].link}
                    className="btn-link btn-link_md default-underline text-uppercase fw-medium"
                    >
                    {collectionList[0].url_label}
                  </Link>
                  <div className="category-masonry__item-category fw-medium">
                    {collectionList[0].label.toUpperCase()}
                  </div>
                </div>}
                {collectionList[2] && <>
                  <div className="pb-4 mb-4 pb-xl-5 mb-xl-5 pt-4 mt-4 pt-xl-5 mt-xl-5"></div>
                  <div className="category-masonry__item">
                    <div className="category-masonry__item-image pb-1 mb-4">
                      <Image
                        loading="lazy"
                        className="h-auto"
                        loader={() => collectionList[2].picture}
                        unoptimized={true}
                        src={collectionList[2].picture}
                        width="672"
                        height="480"
                        alt="image"
                        />
                    </div>
                    <h2>{collectionList[2].title}</h2>
                    <Link
                      href={collectionList[2].link}
                      className="btn-link btn-link_md default-underline text-uppercase fw-medium"
                      >
                      {collectionList[2].url_label}
                    </Link>
                    <div className="category-masonry__item-category fw-medium">
                      {collectionList[2].label.toUpperCase()}
                    </div>
                  </div>
                </>}
                {collectionList[4] && <>
                  <div className="pb-4 mb-4 pb-xl-5 mb-xl-5 pt-4 mt-4 pt-xl-5 mt-xl-5"></div>
                  <div className="category-masonry__item">
                    <div className="category-masonry__item-image pb-1 mb-4">
                      <Image
                        loading="lazy"
                        className="h-auto"
                        loader={() => collectionList[4].picture}
                        unoptimized={true}
                        src={collectionList[4].picture}
                        width="570"
                        height="570"
                        alt="image"
                        />
                    </div>
                    <h2>{collectionList[4].title}</h2>
                    <Link
                      href={collectionList[4].link}
                      className="btn-link btn-link_md default-underline text-uppercase fw-medium"
                      >
                      {collectionList[4].url_label}
                    </Link>
                    <div className="category-masonry__item-category fw-medium">
                      {collectionList[4].label.toUpperCase()}
                    </div>
                  </div>
                </>}
                <div className="pb-4 mb-4 pb-xl-5 mb-xl-5 pt-4 mt-4 pt-xl-5 mt-xl-5"></div>
              </>
            }
          </div>

          {collectionList.length > 0 && 
            <>
              <div className="col-lg-6 px-4 d-lg-flex flex-lg-column align-items-lg-end">
              {collectionList[1] && <>
                <div className="category-masonry__item">
                  <div className="category-masonry__item-image pb-1 mb-4">
                    <Image
                      loading="lazy"
                      className="h-auto"
                      loader={() => collectionList[1].picture}
                      unoptimized={true}
                      src={collectionList[1].picture}
                      width="570"
                      height="631"
                      alt="image"
                      />
                  </div>
                  <h2>{collectionList[1].title}</h2>
                  <Link
                    href={collectionList[1].link}
                    className="btn-link btn-link_md default-underline text-uppercase fw-medium"
                    >
                    {collectionList[1].url_label}
                  </Link>
                  <div className="category-masonry__item-category fw-medium">
                    {collectionList[1].label.toUpperCase()}
                  </div>
                </div>
              </>}

              {collectionList[3] && <>
                <div className="pb-4 mb-4 pb-xl-5 mb-xl-5 pt-4 mt-4 pt-xl-5 mt-xl-5"></div>
                <div className="category-masonry__item">
                  <div className="category-masonry__item-image pb-1 mb-4">
                    <Image
                      loading="lazy"
                      className="h-auto"
                      loader={() => collectionList[3].picture}
                      unoptimized={true}
                      src={collectionList[3].picture}
                      width="450"
                      height="550"
                      alt="image"
                      />
                  </div>
                  <h2>{collectionList[3].title}</h2>
                  <Link
                    href={collectionList[3].link}
                    className="btn-link btn-link_md default-underline text-uppercase fw-medium"
                    >
                    {collectionList[3].url_label}
                  </Link>
                  <div className="category-masonry__item-category fw-medium">
                    {collectionList[3].label.toUpperCase()}
                  </div>
                </div>
              </>}
              {collectionList[5] && <>
                <div className="pb-4 mb-4 pb-xl-5 mb-xl-5 pt-4 mt-4 pt-xl-5 mt-xl-5"></div>
                <div className="category-masonry__item">
                  <div className="category-masonry__item-image pb-1 mb-4">
                    <Image
                      loading="lazy"
                      className="h-auto"
                      loader={() => collectionList[5].picture}
                      unoptimized={true}
                      src={collectionList[5].picture}
                      width="570"
                      height="450"
                      alt="image"
                      />
                  </div>
                  <h2>{collectionList[5].title}</h2>
                  <Link
                    href={collectionList[5].link}
                    className="btn-link btn-link_md default-underline text-uppercase fw-medium"
                    >
                    {collectionList[5].url_label}
                  </Link>
                  <div className="category-masonry__item-category fw-medium">
                    {collectionList[5].label.toUpperCase()}
                  </div>
                </div>
              </>}
              {collectionList[6] && <>
                <div className="pb-4 mb-4 pb-xl-5 mb-xl-5 pt-4 mt-4 pt-xl-5 mt-xl-5"></div>
                <div className="category-masonry__item">
                  <div className="category-masonry__item-image pb-1 mb-4">
                    <Image
                      loading="lazy"
                      className="h-auto"
                      loader={() => collectionList[6].picture}
                      unoptimized={true}
                      src={collectionList[6].picture}
                      width="450"
                      height="550"
                      alt="image"
                      />
                  </div>
                  <h2>{collectionList[6].title}</h2>
                  <Link
                    href={collectionList[6].link}
                    className="btn-link btn-link_md default-underline text-uppercase fw-medium"
                    >
                    {collectionList[6].url_label}
                  </Link>
                  <div className="category-masonry__item-category fw-medium">
                    {collectionList[6].label.toUpperCase()}
                  </div>
                </div>
                <div className="pb-4 mb-4 pb-xl-5 mb-xl-5 pt-4 mt-4 pt-xl-5 mt-xl-5"></div>
              </>}
            </div>
          </>}
        </div>
      </section>
    </>
  );
}
