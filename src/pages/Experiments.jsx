import React from "react";
import UnderConstruction from "../components/common/UnderConstruction"

import { createIdToken } from "../services/credentialManagerService.js";
import { toast } from "react-toastify";

class Experiments extends React.Component {

  state = {
    token: ""
  }

  createToken = async () => {
    try {
      const { data } = await createIdToken();
      this.setState({ token: data.id_token });
    } catch (ex) {
      toast.error("Failed to create token.");
    }
  }

  render() {
    return (
      <div className="container">
        <h1>Experiments</h1>
        <button className="btn btn-success" onClick={this.createToken}>Create Token</button>
        <p>Token: { this.state.token } </p>
        <UnderConstruction />
      </div>
    )
  }
}

export default Experiments;