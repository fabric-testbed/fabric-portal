import InfrastructureMetrics from '../../imgs/toolLinks/InfrastructureMetrics.png';
import PublicMetrics from '../../imgs/toolLinks/PublicMetrics.png';
import OpticalData from '../../imgs/toolLinks/OpticalData.png';
import Parser from 'html-react-parser';

const ToolLinks = ()=> {
  const toolsData = [
    {
      "title": "Public Metrics",
      "image": PublicMetrics,
      "content": "This site contains basic metrics concerning FABRIC network. These metrics are available to anyone. Anyone is allowed anonymous access to Grafana.",
      "link": "https://public-metrics.fabric-testbed.net/grafana/"
    },
    {
      "title": "Infrastructure Metrics",
      "image": InfrastructureMetrics,
      "content": "This site contains enhanced metrics concerning FABRIC site usage and availability. These metrics are available to any FABRIC user. Logon is available as an anonymous Grafana user to anyone with a FABRIC account.",
      "link": "https://infrastructure-metrics.fabric-testbed.net/grafana/"
    },
    {
      "title": "Optical Data",
      "image": OpticalData,
      "content": "This is a space where ESnet shares public Grafana dashboards of targeted data sets. It complements the data found at the <a href='https://my.es.net/'target='_blank' rel='noreferrer'>my.es.net portal</a>. The data comes primarily from ESnet's Stardust system and provides a flexible way to show interesting views of the data.",
      "link": "https://public.stardust.es.net/dashboards/f/fdhq1z6q5smwwb/?orgId=2"
    }
  ]
  return (
    <div className="mt-3">
      {
        toolsData.map((tool, index) =>
        <div className="tool-link-block px-3 mb-5">
          <h3 className="text-primary">
            {tool.title}
          </h3>
          <div className="row mt-3" key={`tool-link-${index}`}>
            <div className="col-12 col-md-6">
              <img src={tool.image} alt={`tool-link-${tool.title}`}/>
            </div>
            <div className="col-12 col-md-6 d-flex flex-column">
              <p>{Parser(tool.content)}</p>
              <a href={tool.link} target="_blank" rel="noreferrer">
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  <i className="fa fa-sign-in mr-2"></i> Open Tool
                </button>
              </a>
            </div>
          </div>
        </div>
        )
      }
    </div>
  )
}

export default ToolLinks;
