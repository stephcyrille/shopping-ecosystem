"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const steps = [
  {
    id: 1,
    href: "/cart",
    number: "01",
    title: "Panier d'achat",
    description: "Gérez votre liste d'achat",
  },
  {
    id: 2,
    href: "/checkout",
    number: "02",
    title: "Livraison et paiement",
    description: "Paiement de vos articles",
  },
  {
    id: 3,
    href: "/order_complete",
    number: "03",
    title: "Validation",
    description: "Vérifiez et envoyez votre commande",
  },
];
export default function ChectoutSteps() {
  const [activePathIndex, setactivePathIndex] = useState(0);
  const pathname = usePathname();
  useEffect(() => {
    const activeTab = steps.filter((elm) => elm.href == pathname)[0];
    const activeTabIndex = steps.indexOf(activeTab);
    setactivePathIndex(activeTabIndex);
  }, [pathname]);
  return (
    <div className="checkout-steps">
      {steps.map((elm, i) => (
        <Link
          key={i}
          href={'#'}
          className={`checkout-steps__item  ${
            activePathIndex >= i ? "active" : ""
          }`}
        >
          <span className="checkout-steps__item-number">{elm.number}</span>
          <span className="checkout-steps__item-title">
            <span>{elm.title}</span>
            <em>{elm.description}</em>
          </span>
        </Link>
      ))}
    </div>
  );
}
