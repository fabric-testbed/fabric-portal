import React from "react";
import { getActiveCarouselItems } from "../../services/announcementService";
import bg1 from "../../imgs/homepage/bg1.jpeg";
import Parser from 'html-react-parser';

class Carousel extends React.Component {
  state = {
    items: [],
  };

  placeholderItems = [
    {
      "announcement_type": "carousel",
      "background_image_url": "https://github.com/fabric-testbed/fabric-portal/assets/37635744/f2365fff-d40e-4204-9a74-a4697ddefc08",
      "button": "Learn More",
      "content": "<ul><li>Build Community: Inspire others with your research, discover collaborators, and find opportunities to showcase your project.</li><li>Conduct Experiments: Take advantage of FABRIC resources to design, deploy, execute, and monitor your experiments.</li><li>Browse the Library: Learn more about FABRIC through publications and user documentation. Discover additional complimentary facilities and testbeds to expand your research.</li></ul>",
      "is_active": true,
      "link": "https://portal.fabric-testbed.net/about/about-fabric",
      "sequence": 1,
      "start_date": "2023-11-02 18:49:51.339756+00:00",
      "title": "FABRIC Portal is your guide, helping make your experiment a success.",
      "uuid": "e0d53c5f-0922-4e3d-8f43-8cd520921ea4"
    }
  ]

  async componentDidMount() {
    try {
      const { data: res } = await getActiveCarouselItems();
      let items = res.results;
      this.setState({ items });
    } catch (err) {
      this.setState({ items: this.placeholderItems });
    }
  }

  parseItems = () => {
    const { items } = this.state;
    const parsed = items.sort((a,b) => (a.sequence > b.sequence) ? 1 : -1);
    return parsed;
  }

  render() {
    const items = this.parseItems();
    return (
      <div
        id="homepageCarouselIndicators"
        className="carousel slide homepage-carousel"
        data-ride="carousel"
      >
        <ol className="carousel-indicators">
          {
            items && items.length > 0 && items.map((item, index) =>
              <li
                key={`carousel-indicators-${index}`}
                data-target="#homepageCarouselIndicators"
                data-slide-to={index}
                className={index === 0? "active" : ""}
              />
            )
          }
        </ol>
        <div className="carousel-inner">
        {
          items && items.length > 0 && items.map((item, index) =>
          <div className={`carousel-item ${index === 0? "active" : ""}`}>
            {
              index === 0 ? 
              <img src={bg1} alt={`FABRIC Portal Homepage Slide ${index}`} className="d-block w-100"/> :
              <img src={item.background_image_url} alt={`FABRIC Portal Homepage Slide ${index}`} className="d-block w-100"/>
            }
            <div className="carousel-caption d-md-block">
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
