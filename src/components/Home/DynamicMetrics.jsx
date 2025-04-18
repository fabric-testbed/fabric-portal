import React from "react";
import AnimatedNumber from "react-animated-number";
import FABRICLogo from "../../imgs/logos/fabric-logo-without-text.png";
import { getCoreApiMetrics, getOrchestratorMetrics } from "../../services/metricsService";
import { getPublications } from "../../services/publicationService.js";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class DynamicMetrics extends React.Component {
  state = {
    metricsItems: [
      {
        name: "Total Slices",
        count: 0
      },
      {
        name: "Active Slices",
        count: 0
      },
      {
        name: "Total Users",
        count: 0
      },
      {
        name: "Total Projects",
        count: 0,
        link: "/experiments/public-projects"
      },
      {
        name: "Publications Using FABRIC",
        count: 0,
        link: "/community/fabric-user-publications"
      }
    ]
  };

  async componentDidMount() {
    try {
      const { data: resCoreMetrics } = await getCoreApiMetrics();
      const { data: resOrchestratorMetrics } = await getOrchestratorMetrics();
      const { data: resPublications } = await getPublications();
      this.setState({
        metricsItems: this.generateMetricsItems(
          resCoreMetrics.results[0], 
          resOrchestratorMetrics.results[0],
          resPublications.results
        )});
    } catch (err) {
      toast.error("Failed to load FABRIC metrics data.")
    }
  }

  generateMetricsItems = (coreMetrics, sliceMetrics, publicationMetrics) => {
    const metricsItems = [];
    // total slices' count and active slices' count
    metricsItems.push({
      name: "Total Slices",
      count: sliceMetrics.slices.active_cumulative +  sliceMetrics.slices.non_active_cumulative
    });
    metricsItems.push({
      name: "Active Slices",
      count: sliceMetrics.slices.active_cumulative
    });

    // active users' count and total project
    metricsItems.push({
      name: "Total Users",
      count: coreMetrics.users.active_cumulative
    });
    metricsItems.push({
      name: "Total Projects",
      count: coreMetrics.projects.active_cumulative + coreMetrics.projects.non_active_cumulative,
      link: "/experiments/public-projects"
    });
    metricsItems.push({
      name: "FABRIC User Publications",
      count: publicationMetrics.length,
      link: "/community/fabric-user-publications"
    });

    return metricsItems;
  }

  render() {
    const { metricsItems: items }  = this.state;

    return (
      <div className="w-100 home-metrix">
        <div className="d-flex flex-column align-item-center justify-content-center px-5 mb-2">
          <div className="me-5 align-self-center">
            <img
              src={FABRICLogo}
              height="100"
              className="d-inline-block align-top"
              alt=""
            />
          </div>
          <div>
            <h2 className="text-center my-5">
              <b>FABRIC</b>’s mission is to be an infrastructure to explore impactful new ideas that are impossible or impractical with the current Internet.
            </h2>
          </div>
        </div>
        <div className="row w-100">
          {
            items.map((i, index) => {
              return (
                <div
                  className="col d-flex flex-column align-items-center"
                  key={`homepage-metrics-${index}`}
                >
                  <div className="hp-metrics-number">
                    <AnimatedNumber
                      component="text"
                      initialValue={0}
                      value={i.count}
                      stepPrecision={0}
                      style={{
                        transition: "0.8s ease-out",
                        fontSize: 48,
                        transitionProperty: "background-color, color, opacity"
                      }}
                      duration={1500}
                      formatValue={n => Intl.NumberFormat("en-US").format(n)}
                    />
                  </div>
                  <div className="home-metrics-text">
                    {i.name}
                    {
                      i.link && <Link to={i.link}>
                        <i className="fa fa-sign-in ms-2"></i>
                      </Link>
                    }
                  </div>
              </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default DynamicMetrics;
