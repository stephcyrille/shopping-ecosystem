"use client";

import { useEffect } from "react";
import tippy from "tippy.js";

export default function Size({ sizeList, onSizeChange }) {
  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  // Check if sizeList exists and map through it
  return (
    <>
      {sizeList ? (
        sizeList.map((elt, key) => (
          <div key={key}> {/* Added key on outermost element */}
            <input type="radio" name="size" id={`swatch-${key}`} style={{ display: 'none'}} defaultChecked={elt.code === 'S' ? true : false}/>
            <label
              className={`swatch js-swatch`}
              htmlFor={`swatch-${key}`}
              aria-label={elt.name}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-tippy-content={elt.name}
              style={{ cursor: 'pointer'}}
              onClick={() => onSizeChange(elt.code)}
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
