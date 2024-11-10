"use client";

import { useEffect, useState } from "react";
import tippy from "tippy.js";

export default function Size({selected ,sizeList, onSizeChange}) {
  const [selectedSize, setSelectedSize] = useState();

  useEffect(() => {
    tippy("[data-tippy-content]");
    setSelectedSize(selected);
  }, [selected]);

  const handleChangeSize = (value) => {
    setSelectedSize(value);
    onSizeChange(value);
  };

  // Check if sizeList exists and map through it
  return (
    <>
      {sizeList ? (
        sizeList.map((elt, key) => (
          <div key={key}> {/* Added key on outermost element */}
            <input 
              type="radio" 
              name="size" 
              id={`swatch-${key}`} 
              style={{ display: 'none'}} 
              checked={elt.code === selectedSize}
              onChange={() => handleChangeSize(elt.code)}
            />
            <label
              className={`swatch js-swatch`}
              htmlFor={`swatch-${key}`}
              aria-label={elt.name}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-tippy-content={elt.name}
              style={{ cursor: 'pointer'}}
              onClick={() => handleChangeSize(elt.code)}
            >
              {elt.code}
            </label>
          </div>
        ))
      ) : (
        <></>  // Empty fragment if no sizeList
      )}
    </>
  );
}
