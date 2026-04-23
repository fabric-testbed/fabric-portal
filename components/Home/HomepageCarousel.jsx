import React, { useState, useEffect } from "react";
import { getActiveCarouselItems } from "../../services/announcementService";
import Carousel from 'react-bootstrap/Carousel';
import Parser from 'html-react-parser';

const placeholderItems = [
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
];

function HomepageCarousel() {
  const [items, setItems] = useState(placeholderItems);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data: res } = await getActiveCarouselItems();
        const fetched = res.results || [];
        // Always keep the fixed first item; append API items that aren't the same
        const rest = fetched.filter(i => i.uuid !== placeholderItems[0].uuid);
        setItems([placeholderItems[0], ...rest]);
      } catch {
        // Keep the initial placeholderItems already in state
      }
    };
    fetchItems();
  }, []);

  const parseItems = () => {
    const parsed = items.sort((a,b) => (a.sequence > b.sequence) ? 1 : -1);
    return parsed;
  };

  const sortedItems = parseItems();

  return (
    <Carousel style={{"marginTop": "3rem"}} fade>
      {
        sortedItems && sortedItems.length > 0 && sortedItems.map((item, index) =>
          <Carousel.Item key={`homepage-carousel-${index}`}>
            <img src={item.background_image_url} alt={`FABRIC Portal Homepage Slide ${index}`} className="d-block w-100"/>
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <div className="homepage-carousel-content">
                {Parser(item.content)}
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-warning"
                role="button"
              >
                {item.button}
              </a>
            </Carousel.Caption>
          </Carousel.Item>
      )}
    </Carousel>
  );
}

export default HomepageCarousel;
