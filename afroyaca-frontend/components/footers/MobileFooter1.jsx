import { useContextElement } from "@/context/Context";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function MobileFooter1() {
  const { userToken } = useContextElement();
  const [showFooter, setShowFooter] = useState(false);
  useEffect(() => {
    setShowFooter(true);
  }, []);

  return (
    <footer
      className={`footer-mobile container w-100 px-5 d-md-none bg-body ${
        showFooter ? "position-fixed footer-mobile_initialized" : ""
      }`}
    >
      <div className="row text-center">
        <div className={userToken ? "col-4" : "col-6"}>
          <Link
            href="/"
            className="footer-mobile__link d-flex flex-column align-items-center"
          >
            <svg
              className="d-block"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#icon_home" />
            </svg>
            <span>{'Accueil'}</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}

        <div className={userToken ? "col-4" : "col-6"}>
          <Link
            href="/shop"
            className="footer-mobile__link d-flex flex-column align-items-center"
          >
            <svg
              className="d-block"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#icon_hanger" />
            </svg>
            <span>{'Boutique'}</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}

        {userToken && <div className="col-4">
          <Link
            href="/account_dashboard"
            className="footer-mobile__link d-flex flex-column align-items-center"
          >
            <div className="position-relative">
              <svg
                className="d-block"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="#icon_user" />
              </svg>
            </div>
            <span>{"Mon compte"}</span>
          </Link>
        </div>}
        {/* <!-- /.col-3 --> */}
      </div>
      {/* <!-- /.row --> */}
    </footer>
  );
}
