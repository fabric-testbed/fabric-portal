import React from "react";
import { getActiveCarouselItems } from "../../services/announcementService";
import { toast } from "react-toastify";
import Parser from 'html-react-parser';

class Carousel extends React.Component {
  state = {
    items: [],
  };

  async componentDidMount() {
    try {
      const { data: res } = await getActiveCarouselItems();
      let items = res.results;
      this.setState({ items });
    } catch (err) {
      toast.error("Failed to load carousel items. Please reload this page.");
    }
  }

  render() {
    const { items } = this.state;
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
        {
          items && items.length > 0 && items.map((item, index) =>
          <div className={`carousel-item ${item.sequence === 1? "active" : ""}`}>
            <img src={item.background_image_url} alt={`FABRIC Portal Homepage Slide ${index}`} className="d-block w-100"/>
            <div className="carousel-caption d-none d-md-block">
              <div className="carousel-caption-content">
                <h3>{item.title}</h3>
                <div className="homepage-carousel-content">
                  {Parser(item.content)}
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="btn btn-sm btn-warning">
                    {item.button}
                  </button>
                </a>
              </div>
            </div>
          </div>
        )
        }
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
