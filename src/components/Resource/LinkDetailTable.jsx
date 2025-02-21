import React, { Component } from "react";

class LinkDetailTable extends Component {
  state = {
    currentOption: "now",
    timeOptions: [
      {
        label: "Now",
        value: "now"
      },
      {
        label: "Hour",
        value: "hour"
      },
      {
        label: "Day",
        value: "day"
      }
    ],
    rows: {
      "now": [
        { label: "In", path: "in_now_value" },
        { label: "Out", path: "out_now_value" }
      ],
      "hour": [
        { label: "In Average", path: "in_hr_avg_value" },
        { label: "In Max", path: "in_hr_max_value" },
        { label: "Out Average", path: "out_hr_avg_value" },
        { label: "Out Max", path: "out_hr_max_value" }
      ],
      "day": [
        { label: "In Average", path: "in_day_avg_value" },
        { label: "In Max", path: "in_day_max_value" },
        { label: "Out Average", path: "out_day_avg_value" },
        { label: "Out Max", path: "out_day_max_value" }
      ]
    }
  }

  handleCheckTime = (option) => {
    this.setState({ currentOption: option})
  }

  render() {
    const {from, to, data} = this.props;
    const { currentOption, timeOptions, rows } = this.state;
    const link1 = data.link1.metric;
    const link2 = data.link2.metric;
    return (
      <div className="d-flex flex-column align-items-center">
        <div>
          {
            timeOptions.map((option, index) =>          
            <div className="form-check form-check-inline" key={`time-option-${index}`}>
              <input
                className="form-check-input"
                type="radio"
                value={option.value}
                checked={currentOption === option.value}
                onClick={() => this.handleCheckTime(option.value)}
              />
              <label className="form-check-label" for="inlineRadio1">{option.label}</label>
            </div>)
          }
        </div>
        <table className={`table resource-detail-table table-striped`}>
          <thead>
            <tr>
              <th scope="col" colSpan="2" className="text-center">
                {from} -&gt; {to}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              rows[currentOption].map((row, index) =>
              <tr>
                <td><span className='font-monospace'>{row.label}</span></td>
                <td>
                  <span className='font-monospace badge bg-primary'>{link1.values[row.path]}</span>
                  <span className='font-monospace ms-1 text-sm-size'>bps</span>
                </td>
              </tr>)
            }
            <tr>
              <td><span className='font-monospace'>capacity</span></td>
              <td>
                <span className='font-monospace badge bg-primary'>{link1.max / 1000000000 || "N/A"}</span> 
                <span className='font-monospace ms-1 text-sm-size'>{link1.max / 1000000000 ? "Gb" : "" }</span>
              </td>
            </tr>
          </tbody>
        </table>
        <table className={`table resource-detail-table table-striped`}>
          <thead>
            <tr>
              <th scope="col" colSpan="2" className="text-center">
                {to} -&gt; {from}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              rows[currentOption].map((row, index) =>
              <tr>
                <td><span className='font-monospace'>{row.label}</span></td>
                <td>
                  <span className='font-monospace badge bg-primary'>{link2.values[row.path]}</span>
                  <span className='font-monospace ms-1 text-sm-size'>bps</span>
                </td>
              </tr>)
            }
            <tr>
              <td><span className='font-monospace'>capacity</span></td>
              <td>
                <span className='font-monospace badge bg-primary'>{link2.max / 1000000000 || "N/A"}</span> 
                <span className='font-monospace ms-1 text-sm-size'>{link2.max / 1000000000 ? "Gb" : "" }</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default LinkDetailTable;
