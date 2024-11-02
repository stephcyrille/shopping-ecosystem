import React from "react";

export default function AdditionalInfo({info}) {
  return (
    <div className="product-single__addtional-info">
      <div className="item">
        <label className="h6">Weight</label>
        <span>{info ? info.weight : ''} kg</span>
      </div>
      <div className="item">
        <label className="h6">Dimensions</label>
        <span>{info ? info.dimensions : ''}</span>
      </div>
      {/* <div className="item">
        <label className="h6">Size</label>
        <span>XS, S, M, L, XL</span>
      </div> */}
      {/* <div className="item">
        <label className="h6">Color</label>
        <span>Black, Orange, White</span>
      </div> */}
      {/* <div className="item">
        <label className="h6">Storage</label>
        <span>Relaxed fit shirt-style dress with a rugged</span>
      </div> */}
    </div>
  );
}
