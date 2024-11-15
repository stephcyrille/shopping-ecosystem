"use client";
import { useContextElement } from "@/context/Context";
import { dashboardMenuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function DashboardSidebar() {
  const pathname = usePathname();
  const { userToken, handleSetUserToken } = useContextElement();

  const handleUserLogout = () => {
    handleSetUserToken(null);
    window.document.location = "/";
  };

  return (
    <div className="col-lg-3">
      <ul className="account-nav">
        {dashboardMenuItems.map((elm, i) => (
          <li key={i}>
            { elm.href === "#" && userToken ?
              <Link
                href={elm.href}
                onClick={handleUserLogout}
                className={`menu-link menu-link_us-s ${
                  pathname == elm.href ? "menu-link_active" : ""
                  } `}
                  >
                  {elm.title}
              </Link>
              :
              <Link
              href={elm.href}
              className={`menu-link menu-link_us-s ${
                pathname == elm.href ? "menu-link_active" : ""
                } `}
                >
                {elm.title}
            </Link>
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
