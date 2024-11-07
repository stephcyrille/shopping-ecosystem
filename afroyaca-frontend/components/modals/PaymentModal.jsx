"use client";

import { useEffect, useRef } from "react";
import { useContextElement } from "@/context/Context";


export default function PaymentModal({ 
  isOpen, setIsModalOpen, handleProceedPayment, phoneNumberIsConfirmed,
  phoneInput, errMsg, handleInputChange, isLoading, paymentErrors,
  ussdMsg, handleCheckPaiement }) {
  
  const { paiementMethod } = useContextElement();
  const modalElement = useRef();
  const modalInstance = useRef(null); // Store the modal instance

  useEffect(() => {
    const bootstrap = require("bootstrap"); // dynamically import bootstrap
    
    // Initialize the modal instance once the modalElement is available
    if (modalElement.current) {
      modalInstance.current = new bootstrap.Modal(modalElement.current, {
        keyboard: false,
      });

      // Add event listener to handle when modal is hidden
      modalElement.current.addEventListener("hidden.bs.modal", () => {
        setIsModalOpen(false); // Set modal state to false when closed
      });
    }

    // Cleanup on unmount
    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, [setIsModalOpen]);

  // Effect to handle modal visibility based on isOpen
  useEffect(() => {
    if (modalInstance.current) {
      if (isOpen) {
        modalInstance.current.show();
      } else {
        modalInstance.current.hide();
      }
    }
  }, [isOpen]);

  const handleSubmitPhone = async (e) => {
    e.preventDefault();
    await handleProceedPayment();
  }

  return (
    <div
      className="modal fade"
      id="paymentPopup"
      ref={modalElement}
      tabIndex="-1"
      data-bs-backdrop="true"
      aria-hidden="true"
    >
      <div className="modal-dialog newsletter-popup modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div className="row p-0 m-0">
            <div className="col-md-12 p-0 d-flex align-items-center">
              <div className="block-newsletter w-100 text-center">
                <h3 className="block__title mb-4">{"PAIEMENT DE LA COMMANDE"}</h3>
                { isLoading ?  
                  <>
                    <p>
                      {"Votre paiement est en cours merci de bien vouloir patienter quelques instants en gardant la page ouverte"}
                    </p>
                    <div className="loader-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="32"
                          strokeWidth="8"
                          stroke="#000000"
                          strokeDasharray="50.26548245743669 50.26548245743669"
                          fill="none"
                          strokeLinecap="round"
                          transform="rotate(219.788 50 50)"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            repeatCount="indefinite"
                            dur="1s"
                            values="0 50 50;360 50 50"
                            keyTimes="0;1"
                          />
                        </circle>
                      </svg>
                      <p>{"Paiement en cours..."}</p>
                    </div>
                  </> 
                  :
                  <div>
                    { !phoneNumberIsConfirmed ?
                      <>
                        <form
                          onSubmit={handleSubmitPhone}
                          className="footer-newsletter__form position-relative bg-body offset-lg-3 offset-md-3 col-lg-6 col-md-6"
                        >
                          <p>
                            {"Bien vouloir confirmer votre numéro de téléphone"}
                          </p>
                          <div className="form-floating my-3">
                            <input
                              className="form-control border-2 text-center"
                              type="phone"
                              name="phoneConfirmation"
                              id="phoneConfirmation"
                              placeholder="699 000 000"
                              value={phoneInput}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="phoneConfirmation">{"Confirmation du numéro *"}</label>
                            {errMsg && <small className="text-danger">{errMsg}</small>}
                          </div>

                          <button className="btn btn-primary btn-checkout mt-4" type="submit">
                            {"CONFIRMER"}
                          </button>
                        </form>
                      </> : paymentErrors ? 
                      <>
                        <div className="badge text-start p-3 d-block bg-danger mb-4" style={{ fontSize: "0.9rem", color: "red" }}>
                          <ul className="m-0">
                            <li>{paymentErrors.errorMessage && paymentErrors.errorMessage}</li>
                            <li>{paymentErrors.message && paymentErrors.message}</li>
                          </ul>
                        </div>
                        <div className="button-wrapper container">
                          <button 
                            className="btn btn-primary btn-checkout"
                            onClick={() => setIsModalOpen(false)}
                          >
                            {"MODIFIER LES INFORMATIONS"}
                          </button>
                        </div>
                      </> : 
                      <>
                        <p className="text-justify">
                          {"Vous allez être invité à confirmer le paiement sur votre mobile."}<br />
                          {`Bien vouloir valider le paiement en saisissant votre code secret ${paiementMethod === 'cm.orange' ? 'Orange Money' : paiementMethod === 'cm.mtn' ? 'MTN Mobile Money' : paiementMethod}`} <br />
                          {`Sinon ${ussdMsg.toLocaleLowerCase()}`}
                        </p>

                        <div className="button-wrapper container">
                          <button 
                            className="btn btn-primary btn-checkout"
                            onClick={handleCheckPaiement}
                          >
                            {"TERMINER LE PAIEMENT"}
                          </button>
                        </div>
                      </>
                          
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
