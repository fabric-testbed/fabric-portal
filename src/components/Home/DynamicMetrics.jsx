import React from "react";
import AnimatedNumber from "react-animated-number";

class DynamicMetrics extends React.Component {
  state = {
    data: {
      total_slices_count: 25392,
      active_slices_count: 435,
      total_users_count: 1392,
      total_projects_count: 164
    }
  };

  render() {
    const data = this.state.data;

    return (
      <div className="w-100 home-metrix">
        <h2 className="text-center mb-5">
          FABRIC’s mission is to be an infrastructure to explore impactful new ideas that are impossible or impractical with the current Internet.
        </h2>
        <div className="row w-100">
          <div className="col d-flex flex-column align-items-center w-25">
            <div className="hp-metrics-number">
              <AnimatedNumber
                component="text"
                initialValue={0}
                value={data.total_slices_count}
                stepPrecision={0}
                style={{
                  transition: "0.8s ease-out",
                  fontSize: 48,
                  transitionProperty: "background-color, color, opacity"
                }}
                duration={2000}
                formatValue={n => Intl.NumberFormat("en-US").format(n)}
              />
            </div>
            <div className="home-metrics-text">
              Total Slices
            </div>
          </div>
          <div className="col d-flex flex-column align-items-center w-25">
            <div className="hp-metrics-number">
              {data.active_slices_count}
            </div>
            <div className="home-metrics-text">
              Active Slices
            </div>
          </div>
          <div className="col d-flex flex-column align-items-center w-25">
            <div className="hp-metrics-number">
              {data.total_users_count}
            </div>
            <div className="home-metrics-text">
              Active Users
            </div>
          </div>
          <div className="col d-flex flex-column align-items-center w-25">
            <div className="hp-metrics-number">
              {data.total_projects_count}
            </div>
            <div className="home-metrics-text">
              Total Projects
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DynamicMetrics;
