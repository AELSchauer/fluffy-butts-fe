import React, { useEffect, useState } from "react";
import _ from "lodash";
import axios from "axios";
import "../_product-page.scss";

const Listings = ({
  product,
  product: {
    name,
    images: [image = {}] = [],
    listings: propListings = [],
    tags = [],
  },
  productLine: {
    name: productLineName,
    brand = {},
    images: [defaultImage = {}] = [],
  },
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState(_.sortBy(propListings, "price"));

  const formatListings = async () => {
    // This call will get blocked by AdBlocker, so create a pop-up
    const { data: { country_name: userCountry, currency: userCurrency } = {} } =
      (await axios.get("https://ipapi.co/json/")) || {};
    const availableListings = propListings.filter(
      ({ retailer: { shipsTo = [] } }) =>
        shipsTo.map(({ country }) => country).includes(userCountry)
    );

    let formattedListings = [];
    if (!availableListings.some(({ currency }) => currency !== userCurrency)) {
      formattedListings = availableListings;
    } else {
      const { data: { rates = {} } = {} } =
        (await axios.get(
          `https://api.exchangeratesapi.io/latest?base=${userCurrency}`
        )) || {};

      formattedListings = availableListings.map((listing) => {
        return {
          ...listing,
          calculated: listing.currency !== userCurrency && listing.currency,
          currency: userCurrency,
          price: (parseFloat(listing.price) / rates[listing.currency]).toFixed(
            2
          ),
        };
      });
    }

    setListings(_.sortBy(formattedListings, "price"));
    setIsLoading(false);
  };

  useEffect(() => {
    formatListings().catch((err) => console.log(err));
  }, [product]);

  const currencySymbols = {
    CAD: "$",
    USD: "$",
  };

  const buildSingleSizeRow = ({
    id,
    currency,
    url: productUrl,
    price,
    calculated,
    retailer,
    sizes: [{ url: sizeUrl } = {}] = [],
  }) => {
    const title = retailer.name || (url.match(/\w*\.com/g) || [])[0];
    const url = sizeUrl || productUrl;
    return (
      <a className="listing listing-link" href={url} target="_blank" key={id}>
        <div className="listing-title listing-prop">
          <img
            className="retailer-icon"
            src={`https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/Favicons/${
              retailer.name.replace(/ /g, "+") || "default"
            }.png`}
          />
          {title}
        </div>
        <div className="listing-price listing-prop">
          <span className="listing-currency">{currencySymbols[currency]}</span>
          {price}
          {calculated ? (
            <span className="listing-price-is-calculated">*</span>
          ) : (
            ""
          )}
        </div>
      </a>
    );
  };

  const buildMutliSizeRow = (listing) => JSON.stringify(listing);

  const renderContent = () => {
    return (
      <React.Fragment>
        <h3 className="section-header listings-header">Product Listings</h3>
        {name ? (
          <div className="container listings">
            {listings.map((listing) => {
              const useSingleRow =
                !listing.sizes ||
                listing.sizes.length < 2 ||
                listing.sizes.every(({ url }) => url === listing.url);
              return useSingleRow
                ? buildSingleSizeRow(listing)
                : buildMutliSizeRow(listing);
            })}
          </div>
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
      {isLoading ? "Heyyyyy" : renderContent()}
    </div>
  );
};

export default Listings;
