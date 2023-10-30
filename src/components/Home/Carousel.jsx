import React from "react";
import { getActiveCarouselItems } from "../../services/announcementService";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import bg1 from "../../imgs/homepage/bg1.jpeg";
import bg2 from "../../imgs/homepage/bg2.jpeg";
import bg3 from "../../imgs/homepage/bg3.jpeg";

class Carousel extends React.Component {
  state = {
    showSpinner: false,
    items: [],
  };

  async componentDidMount() {
    this.setState({ showSpinner: true });

    try {
      const { data: res } = await getActiveCarouselItems();
      let items = res.results;
      this.setState({ items, showSpinner: false });
    } catch (err) {
      this.setState({ showSpinner: false });
      toast.error("Failed to load carousel items. Please reload this page.");
    }
  }

  render() {
    const { items, showSpinner } = this.state;
    return (
      <div
      id="homepageCarouselIndicators"
      className="carousel slide homepage-carousel"
      data-ride="carousel"
    >
      <ol className="carousel-indicators">
        <li data-target="#homepageCarouselIndicators" data-slide-to="0" className="active"></li>
        <li data-target="#homepageCarouselIndicators" data-slide-to="1"></li>
        <li data-target="#homepageCarouselIndicators" data-slide-to="2"></li>
      </ol>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={bg1} alt={`FABRIC Portal Homepage Slide 1`} className="d-block w-100"/>
          <div className="carousel-caption d-none d-md-block">
            <div className="carousel-caption-content">
              <h3>FABRIC Portal is your guide, helping make your experiment a success.</h3>
              <ul>
                <li>Build Community: Inspire others with your research, discover collaborators, and find opportunities to showcase your project.</li>
                <li>Conduct Experiments: Take advantage of FABRIC resources to design, deploy, execute, and monitor your experiments.</li>
                <li>Browse the Library: Learn more about FABRIC through publications and user documentation. Discover additional complimentary facilities and testbeds to expand your research.</li>
              </ul>
              <NavLink to="/about/about-fabric">
                <button className="btn btn-sm btn-warning">Learn More</button>
              </NavLink>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img src={bg2} alt={`FABRIC Portal Homepage Slide 2`} className="d-block w-100"/>
          <div className="carousel-caption d-none d-md-block">
            <div className="carousel-caption-content">
              <h3>
                NGI Enrichers program seeks host organizations for funded researchers
              </h3>
              <p>
                Next Generation Internet (NGI) Enrichers is an initiative that supports transatlantic research cooperation in areas related to the next generation of the internet, such as networking, cybersecurity, virtual reality, 5G, machine learning, and several others.
              </p>
              <a
                href="https://fabric-testbed.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn btn-sm btn-warning">Learn More</button>
              </a>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img src={bg3} alt={`FABRIC Portal Homepage Slide 3`} className="d-block w-100"/>
          <div className="carousel-caption d-none d-md-block">
            <div className="carousel-caption-content">
              <h3>
                NSF FABRIC Project Completes Phase 1, Enabling Early Testing of Unprecedented Large-scale Network Experiments
              </h3>
              <p>
                The NSF-funded FABRIC project has made steady progress establishing the groundbreaking network testbed infrastructure to reimagine the way large amounts of data are generated, stored, analyzed, and transmitted across the world.
              </p>
              <a
                href="https://fabric-testbed.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn btn-sm btn-warning">Learn More</button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <a className="carousel-control-prev" href="#homepageCarouselIndicators" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href="#homepageCarouselIndicators" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </div>
    );
  }
}

export default Carousel;
