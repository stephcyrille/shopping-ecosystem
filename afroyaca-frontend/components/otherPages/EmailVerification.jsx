'use client'; // Mark as a client component if it needs client-side features

import { useSearchParams, usePathname } from 'next/navigation';
import React, {useEffect} from 'react'
import Link from "next/link";

export const EmailVerification = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract `code` and `token` from the URL path
  useEffect(() => {
    const urlSegments = pathname.split('/').filter(Boolean);
    const code = urlSegments[urlSegments.length - 2];
    const token = urlSegments[urlSegments.length - 1];

    console.log('Code:', code);
    console.log('Token:', token);

    if (code && token) {
      activateUser(code, token);
    }
  }, [pathname]);

  const activateUser = async (code, token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/users/activation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: code, token: token }),
      });

      if (response.ok) {
        console.log('User activated successfully');
      } else {
        console.error('Failed to activate user', response);
      }
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  return (
    <div className="my-4">
      <p className="pb-4">
        {"Merci d'avoir confirmé votre adresse email. Votre compte sur Afro Yaca Drum est maintenant \
        pleinement actif. Vous pouvez désormais profiter de toutes nos fonctionnalités."}
      </p>
      
      <hr />
      <h3 className="py-4">{"Que faire ensuite ?"}</h3>
      
      <p>
        {"Se connecter à votre compte :"} 
        <Link href="/login" className="text-link">{" Cliquez ici pour vous connecter"}</Link> <br />
        
        {"Explorer nos articles : "}
          <Link href="/shop" className="text-link">{"Aller à la boutique"}</Link> <br />
      </p>

      <p>
        {"Nous sommes ravis de vous compter parmi nous ! 😊"}
      </p>
    </div>
  )
}
