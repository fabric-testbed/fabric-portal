import React from "react";
import Parser from 'html-react-parser';

const heroItem = {
  backgroundImage: "/imgs/homepage/bg1.jpeg",
  button: "Learn More",
  content: "<ul><li>Build Community: Inspire others with your research, discover collaborators, and find opportunities to showcase your project.</li><li>Conduct Experiments: Take advantage of FABRIC resources to design, deploy, execute, and monitor your experiments.</li><li>Browse the Library: Learn more about FABRIC through publications and user documentation. Discover additional complimentary facilities and testbeds to expand your research.</li></ul>",
  link: "https://www.whatisfabric.net/about",
  title: "FABRIC Portal is your guide, helping make your experiment a success.",
};

function HomepageCarousel() {
  return (
    <div className="homepage-hero" style={{ marginTop: "3rem", position: "relative", background: "#374955" }}>
      <img
        src={heroItem.backgroundImage}
        alt="FABRIC Portal Homepage"
        className="d-block w-100 carousel-bg-image"
        style={{ maxHeight: "32rem", objectFit: "cover" }}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
      />
      <div className="carousel-caption">
        <h3>{heroItem.title}</h3>
        <div className="homepage-carousel-content">
          {Parser(heroItem.content)}
        </div>
        <a
          href={heroItem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-warning"
          role="button"
        >
          {heroItem.button}
        </a>
      </div>
      {/* Mobile-only caption shown below the image */}
      <div className="carousel-caption-mobile">
        <h3>{heroItem.title}</h3>
        <div className="homepage-carousel-content">
          {Parser(heroItem.content)}
        </div>
        <a
          href={heroItem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-warning btn-sm"
          role="button"
        >
          {heroItem.button}
        </a>
      </div>
    </div>
  );
}

export default HomepageCarousel;
