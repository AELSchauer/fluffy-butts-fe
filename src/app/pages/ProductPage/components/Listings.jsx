import React, { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import { supportedCountries } from "../../../utils/supported-countries";
import "../_product-page.scss";

const Listings = ({
  country,
  product,
  product: { name, listings: propListings = [] },
}) => {
  const [isCurrencyConverted, setIsCurrencyConverted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState(_.sortBy(propListings, "price"));

  const formatListings = async () => {
    let formattedListings = [];
    try {
      const { name: userCountry, currency: userCurrency } = country;
      // Hide this functionality for the time being while I figure out a new way to get exchange rates
      const availableListings = propListings;

      // const availableListings =
      //   userCountry === "World" || userCountry === ""
      //     ? propListings
      //     : _.chain(propListings)
      //         .filter(({ retailer: { shipping: { shipsTo = [] } = {} } }) =>
      //           shipsTo.map(({ country }) => country).includes(userCountry)
      //         )
      //         .groupBy("retailer.name")
      //         .values()
      //         .reduce(
      //           (availableListings, listings) =>
      //             availableListings.concat(
      //               listings.find(
      //                 ({ currency }) => currency === userCurrency
      //               ) || listings[0]
      //             ),
      //           []
      //         )
      //         .value();

      // if (
      //   !userCurrency ||
      //   !availableListings.some(({ currency }) => currency !== userCurrency)
      // ) {
      formattedListings = availableListings.map(({ price, ...listing }) => ({
        ...listing,
        price: parseFloat(price).toFixed(2),
      }));
      // } else {
      //   const { data: { rates = {} } = {} } =
      //     (await axios.get(
      //       `http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.$REACT_APP_EXCHANGE_RATE_KEY}symbols=${userCurrency}`
      //     )) || {};

      //   formattedListings = availableListings.map((listing) => {
      //     return {
      //       ...listing,
      //       calculated: listing.currency !== userCurrency && listing.currency,
      //       currency: userCurrency,
      //       price: (
      //         parseFloat(listing.price) / rates[listing.currency]
      //       ).toFixed(2),
      //     };
      //   });
      // }
      // setIsCurrencyConverted(true);
    } catch (err) {
      formattedListings = propListings.map(({ price, ...listing }) => ({
        ...listing,
        price: parseFloat(price).toFixed(2),
      }));
    }

    setListings(_.sortBy(formattedListings, "price"));
    setIsLoading(false);
  };

  useEffect(() => {
    formatListings().catch((err) => console.log(err));
  }, [product, country]);

  const renderPriceDisplay = ({ calculated, currency, price }) => {
    const symbol = supportedCountries.find(
      (supportedCountry) => supportedCountry.currency === currency
    ).symbol;

    // Hide this functionality for the time being while I figure out a new way to get exchange rates
    // const symbol =
    //   country.name === "World"
    //     ? supportedCountries.find(
    //         (supportedCountry) => supportedCountry.currency === currency
    //       ).symbol
    //     : country.symbol[2];
    return (
      <div className="listing-price listing-prop">
        <span className="listing-currency">{symbol}</span>
        {price}
        {calculated ? (
          <span className="listing-price-is-calculated">*</span>
        ) : (
          ""
        )}
      </div>
    );
  };;

  const buildSingleSizeRow = ({
    id,
    url: productUrl,
    retailer,
    sizes: [{ url: sizeUrl } = {}] = [],
    ...listing
  }) => {
    const url = sizeUrl || productUrl;
    const title = retailer.name || (url.match(/\w*\.com/g) || [])[0];
    return (
      <a className="listing listing-link" href={url} target="_blank" key={id}>
        <div className="listing-title listing-prop">
          <img
            className="retailer-icon"
            src={`https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/Favicons/${
              retailer.name.replace(/ /g, "+").replace(/'/g, "") || "default"
            }.png`}
          />
          {title}
        </div>
        {renderPriceDisplay(listing)}
      </a>
    );
  };

  const buildMutliSizeRow = ({ id, url, retailer, sizes = [], ...listing }) => {
    const title = retailer.name || (url.match(/\w*\.com/g) || [])[0];
    return (
      <div className="listing" key={id}>
        <div
          className="listing-header"
          data-toggle="collapse"
          data-target={`#collapse-${id}`}
          aria-expanded="true"
          aria-controls={`collapse-${id}`}
        >
          <div className="listing-title listing-prop">
            <img
              className="retailer-icon"
              src={`https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/Favicons/${
                retailer.name.replace(/ /g, "+").replace(/'/g, "") || "default"
              }.png`}
            />
            {title}
          </div>
          {renderPriceDisplay(listing)}
        </div>
        <div
          id={`collapse-${id}`}
          className="collapse listing-more-info"
          data-parent="#listings-accordion"
        >
          <div className="sizes-available">
            <div>Sizes available:</div>
            <ul>
              {sizes.map(({ name, url }, index) => (
                <li key={index}>
                  <a href={url} target="_blank">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="shipping-policy"
            dangerouslySetInnerHTML={{ __html: retailer.shipping.policy }}
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        <h3 className="section-header listings-header">Product Listings</h3>
        {name && listings.length ? (
          <div className="accordion container listings" id="listings-accordion">
            {listings.map(({ sizes = [], ...listing } = {}) => {
              const useSingleRow = sizes.every(
                ({ name } = {}) => name === "one size"
              );
              return useSingleRow
                ? buildSingleSizeRow({ ...listing, sizes })
                : buildMutliSizeRow({ ...listing, sizes });
            })}
            {listings.some(({ calculated }) => calculated) ? (
              <p className="exchange-rate-note">
                Prices with an asterisk (*) have been converted according to
                current exchange rates, and do not reflect any additional
                duties, taxes, and/or fees.
              </p>
            ) : (
              ""
            )}
          </div>
        ) : window.location.search.includes("variant=") ? (
          <p className="notification">
            Aw, shucks! It looks like this pattern isn't available in your
            country.
          </p>
        ) : (
          <p className="notification">
            Select a pattern option above to see listings.
          </p>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="listings-section">
      {isLoading ? "Loading..." : renderContent()}
    </div>
  );
};

export default Listings;
