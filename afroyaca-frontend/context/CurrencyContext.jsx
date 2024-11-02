
"use client";

import React, { useContext, useState, useEffect } from 'react';

const currencyContext = React.createContext();


export default function CurrencyProvider ({children}) {
  const [currency, setCurrency] = useState('FCFA');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') || 'FCFA';
    setCurrency(savedCurrency);
  }, []);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const contextElement = {
    currency, 
    changeCurrency
  };

  return (
    <currencyContext.Provider value={contextElement}>
      {children}
    </currencyContext.Provider>
  );
};

export const useCurrency = () => {
  return useContext(currencyContext)
};
