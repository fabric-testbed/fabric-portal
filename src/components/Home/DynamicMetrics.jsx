import React from "react";
import AnimatedNumber from "react-animated-number";
import FABRICLogo from "../../imgs/logos/fabric-logo-without-text.png";
import { getCoreApiMetrics, getOrchestratorMetrics } from "../../services/metricsService";
import { toast } from "react-toastify";

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
        name: "Active Users",
        count: 0
      },
      {
        name: "Total Projects",
        count: 0
      }
    ]
  };

  async componentDidMount() {
    try {
      const { data: resCoreMetrics } = await getCoreApiMetrics();
      const { data: resOrchestratorMetrics } = await getOrchestratorMetrics();
      this.setState({
        metricsItems: this.generateMetricsItems(resCoreMetrics.results[0], resOrchestratorMetrics.results[0])
      });
    } catch (err) {
      toast.error("Failed to load FABRIC metrics data.")
    }
  }

  generateMetricsItems = (coreMetrics, sliceMetrics) => {
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
      name: "Active Users",
      count: coreMetrics.users.active_cumulative
    });
    metricsItems.push({
      name: "Total Projects",
      count: coreMetrics.projects.active_cumulative + coreMetrics.projects.non_active_cumulative
    });

    return metricsItems;
  }

  render() {
    const { metricsItems: items }  = this.state;

    return (
      <div className="w-100 home-metrix">
        <div className="d-flex flex-column align-item-center justify-content-center px-5 mb-2">
          <div className="mr-5 align-self-center">
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
                  className="col d-flex flex-column align-items-center w-25"
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
