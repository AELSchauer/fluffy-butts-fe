import React from "react";
import "./_home-page.scss";

const HomePage = () => {
  return (
    <section className="home-page page">
      <div className="home-page-content">
        <h1>Welcome to Fluffy Butts!</h1>
        <div className="home-page-image"></div>
        <p>
          Our goal is to build a site for anyone to search for different brands,
          styles, and sizes of cloth diapers around the world.
        </p>
        <p>
          This site is still very much in development, so please excuse our
          bugs!
        </p>
      </div>
    </section>
  );
};

export default HomePage;
