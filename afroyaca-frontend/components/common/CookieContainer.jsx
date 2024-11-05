"use client";

import { useState } from "react";

export default function CookieContainer() {
  const [show, setShow] = useState(true);
  return (
    <>
      {show && (
        <div
          className="cookieConsentContainer"
          style={{ opacity: 1, display: "block" }}
        >
          <div className="cookieDesc">
            <p style={{ textAlign: 'justify' }}>
              {"Afin de pouvoir vous proposer une expérience d'achat personalisée, \
              notre site utilise les Cookies. En continuant d'utiliser ce site, \
              vous acceptez nos conditions"}
            </p>
          </div>
          <div className="cookieButton">
            <a className="my-2" onClick={() => setShow(false)}>{"Accepter"}</a>
            <a onClick={() => setShow(false)}>{"Refuser"}</a>
          </div>
        </div>
      )}
    </>
  );
}
