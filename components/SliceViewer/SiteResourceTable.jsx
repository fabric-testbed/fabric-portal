const SiteResourceTable = props => {
  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col">Cores</th>
          <th scope="col">RAM(GB)</th>
          <th scope="col">Disk(GB)</th>
          <th scope="col">GPU</th>
          <th scope="col">SmartNIC</th>
          <th scope="col">SharedNIC</th>
          <th scope="col">NVME</th>
          <th scope="col">FPGA</th>
          <th scope="col">Switch</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.site.freeCore}</td>
          <td>{props.site.freeRAM}</td>
          <td>{props.site.freeDisk}</td>
          <td>{props.site.freeGPU}</td>
          <td>{props.site.freeSmartNIC}</td>
          <td>{props.site.freeSharedNIC}</td>
          <td>{props.site.freeNVME}</td>
          <td>{props.site.freeFPGA}</td>
          <td>{props.site.freeSwitch}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default SiteResourceTable ;
