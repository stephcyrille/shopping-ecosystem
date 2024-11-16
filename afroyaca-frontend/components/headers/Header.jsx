"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Nav from "./components/Nav";
import { openCart } from "@/utlis/openCart";
import CartLength from "./components/CartLength";
import Image from "next/image";
import User from "./components/User";
import SearchPopup from "./components/SearchPopup";
import { useContextElement } from "@/context/Context";

export default function Header() {
  const { userToken } = useContextElement();
  const [scrollDirection, setScrollDirection] = useState("down");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    const lastScrollY = { current: window.scrollY };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      id="header"
      className={`header header_sticky header-fullwidth   header_sticky ${
        scrollDirection == "up" ? "header_sticky-active" : "position-absolute"
      }`}
    >
      <div className="header-desk header-desk_type_1">
        <div className="logo">
          <Link href="/">
            <Image
              src="/assets/images/logo-ayd.jpg"
              width={60}
              height={60}
              alt="Afro yaca brand"
              className="logo__image d-block"
            />
          </Link>
        </div>
        {/* <!-- /.logo --> */}

        <nav className="navigation">
          <ul className="navigation__list list-unstyled d-flex">
            <Nav />
          </ul>
          {/* <!-- /.navigation__list --> */}
        </nav>
        {/* <!-- /.navigation --> */}

        <div className="header-tools d-flex align-items-center">
          <SearchPopup />
          {/* <!-- /.header-tools__item hover-container --> */}

          <div className="header-tools__item hover-container">
              {!userToken ? 
                <a className="header-tools__item js-open-aside" href="#">
                    <User />
                </a>
                : <Link href={'/account_dashboard'} title={"Tableau de bord"}>
                    <svg
                      className="d-block"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="#000000"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_user" style={{ color: pathname.includes('/account_') ? "#c3292a" : "" }}/>
                    </svg>
                  </Link>
              }
          </div>

          {/* <Link className="header-tools__item" href="/account_wishlist">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#icon_heart" />
            </svg>
          </Link> */}

          {(pathname !== '/cart' && pathname !== '/checkout' && pathname !== '/order_complete') &&
            <a
            onClick={() => openCart()}
            className="header-tools__item header-tools__cart js-open-aside"
            >
              <svg
                className="d-block"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <use href="#icon_cart" />
              </svg>
              <span className="cart-amount d-block position-absolute js-cart-items-count">
                <CartLength />
              </span>
            </a>}

          {/* <a
            className="header-tools__item"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#siteMap"
          >
            <svg
              className="nav-icon"
              width="25"
              height="18"
              viewBox="0 0 25 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="25" height="2" />
              <rect y="8" width="20" height="2" />
              <rect y="16" width="25" height="2" />
            </svg>
          </a> */}
        </div>
        {/* <!-- /.header__tools --> */}
      </div>
      {/* <!-- /.header-desk header-desk_type_1 --> */}
    </header>
  );
}
