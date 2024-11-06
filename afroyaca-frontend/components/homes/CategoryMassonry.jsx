'use client'

import React, { useState, useEffect } from 'react'
import Link from "next/link";
import Image from "next/image";
import DevCategoryMassonry from './DevCategoryMassonry'

export default function CategoryMassonry() {
  const [collectionList, setCollectionList] = useState([]);


  useEffect(() => {
    async function fetchHomeCollectionList() {
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apis/home/collections`);
      let res_data = await res.json();
      let data = res_data.data.result;

      if(data.length > 0){
        setCollectionList(data);
      }
    }
    fetchHomeCollectionList();
  }, [])

  return (
    <section className="category-masonry container">
      <div className="row">
            

        
      </div>
    </section>
  );
}
