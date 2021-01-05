import React from "react";
import "./_diaper-types-page.scss";

const DiaperTypesPage = () => {
  return (
    <section className="diaper-types-page page">
      <div className="diaper-types-page-content">
        <h1>Diaper Types</h1>
        <ul>
          <li>
            <h2>Flats</h2>
          </li>
          <li>
            <h2>Prefolds</h2>
          </li>
          <li>
            <h2>Fitted Diapers</h2>
          </li>
          <li>
            <h2>Diaper Covers</h2>
          </li>
          <li>
            <h2>Pocket Diapers</h2>
          </li>
          <li>
            <h2>Hybrids / All-In-Two Diapers (AI2)</h2>
            <div className="hybrid-images">
              <img
                className="hybrid-diaper-image"
                src="https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/Fluffy+Butts/Diaper+Types/Hybrid+--+Best+Bottom.jpg"
                alt="Hybrid Diaper by Best Bottom"
              />
              <img
                className="hybrid-diaper-image"
                src="https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/Fluffy+Butts/Diaper+Types/Hybrid+--+GroVia.jpg"
                alt="Hybrid Diaper by GroVia"
              />
            </div>
          </li>
          <li>
            <h2>All-In-One Diapers (AIO)</h2>
          </li>
          <li>
            <h2>Pull-Ups / Trainers</h2>
          </li>
          <li>
            <h2>Swim Diapers</h2>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default DiaperTypesPage;
