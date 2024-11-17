import React from 'react'

export const CheckoutFormUser = ({formData, handleInputChange, errors, idDDActive, selectedRegion, 
  setIdDDActive, setSearchQuery, countries, isAccountCreated, handleCheckboxChange, searchQuery,
  setSelectedRegion}) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={handleInputChange} />
          <label htmlFor="firstName">{"Prénom *"}</label>
          {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleInputChange} />
          <label htmlFor="lastName">{"Nom *"}</label>
          {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating my-3">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange} />
          <label htmlFor="email">{"Email *"}</label>
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control"
            id="companyName"
            placeholder={"Nom de la société (optionel)"}
            value={formData.companyName}
            onChange={handleInputChange} />
          <label htmlFor="companyName">
            {"Nom de la société (optionel)"}
          </label>
        </div>
      </div>
      <div className="col-md-12">
        <div className="search-field my-3">
          <div
            className={`form-label-fixed hover-container ${idDDActive ? "js-content_visible" : ""}`}
          >
            <label htmlFor="search-dropdown" className="form-label">
              {"Pays *"}
            </label>
            <div className="js-hover__open">
              <input
                type="text"
                className="form-control form-control-lg search-field__actor search-field__arrow-down"
                id="search-dropdown"
                name="search-keyword"
                value={selectedRegion}
                readOnly
                placeholder={"Choisissez la localisation..."}
                onClick={() => {
                  errors.country = "";
                  setIdDDActive((pre) => !pre);
                } } />
            </div>
            <div className="filters-container js-hidden-content mt-2">
              <div className="search-field__input-wrapper">
                <input
                  type="text"
                  className="search-field__input form-control form-control-sm bg-lighter border-lighter"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  } } />
              </div>
              <ul className="search-suggestion list-unstyled">
                {countries
                  .filter((elm) => elm.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((elm, i) => (
                    <li
                      onClick={() => {
                        setSelectedRegion(elm);
                        setIdDDActive(false);
                      } }
                      key={i}
                      className="search-suggestion__item js-search-select"
                    >
                      {elm}
                    </li>
                  ))}
              </ul>
            </div>
            {errors.country && <small className="text-danger">{errors.country}</small>}
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Adresse"
            value={formData.address}
            onChange={handleInputChange} />
          <label htmlFor="address">{"Adresse *"}</label>
          {errors.address && <small className="text-danger">{errors.address}</small>}
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control"
            id="city"
            placeholder="Ville"
            value={formData.city}
            onChange={handleInputChange} />
          <label htmlFor="city">{"Ville *"}</label>
          {errors.city && <small className="text-danger">{errors.city}</small>}
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control"
            id="zipCode"
            placeholder="Code postal"
            value={formData.zipCode}
            onChange={handleInputChange} />
          <label htmlFor="zipCode">{"Code postal *"}</label>
          {errors.zipCode && <small className="text-danger">{errors.zipCode}</small>}
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control"
            id="region"
            placeholder="Région (Province)"
            value={formData.region}
            onChange={handleInputChange} />
          <label htmlFor="region">{"Région *"}</label>
          {errors.region && <small className="text-danger">{errors.region}</small>}
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control"
            id="phone"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={handleInputChange} />
          <label htmlFor="phone">{"Téléphone (sans l'indicateur regionnal)*"}</label>
          {errors.phone && <small className="text-danger">{errors.phone}</small>}
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-check mt-3">
          <input
            className="form-check-input form-check-input_fill cursor-pointer"
            type="checkbox"
            value={"create"}
            id="create_account"
            checked={isAccountCreated} // Bind to state
            onChange={handleCheckboxChange} />
          <label className="form-check-label cursor-pointer" htmlFor="create_account">
            {"CRÉER UN COMPTE ?"}
          </label>
        </div>
      </div>
    </div>
  )
}

