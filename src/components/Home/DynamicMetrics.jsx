import React from "react";
import AnimatedNumber from "react-animated-number";
import FABRICLogo from "../../imgs/logos/fabric-logo-without-text.png";

class DynamicMetrics extends React.Component {
  state = {
    data: {
      total_slices_count: 25392,
      active_slices_count: 435,
      total_users_count: 1392,
      total_projects_count: 164
    },
    metricsItems: [
      {
        name: "Total Slices",
        count: 25392
      },
      {
        name: "Active Slices",
        count: 435
      },
      {
        name: "Active Users",
        count: 1392
      },
      {
        name: "Total Projects",
        count: 164
      }
    ]
  };

  render() {
    const { metricsItems: items }  = this.state;

    return (
      <div className="w-100 home-metrix">
        <div className="d-flex flex-row px-5 mb-2">
          <div className="mr-5">
            <img
              src={FABRICLogo}
              height="100"
              className="d-inline-block align-top"
              alt=""
            />
          </div>
          <div>
            <h2 className="text-center mb-5">
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
                      duration={1600}
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
