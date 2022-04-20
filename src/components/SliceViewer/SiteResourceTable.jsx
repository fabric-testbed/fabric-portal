const SiteResourceTable = props => {
  return (
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Core</th>
          <th scope="col">Ram</th>
          <th scope="col">Disk</th>
          <th scope="col">GPU</th>
          <th scope="col">SmartNIC</th>
          <th scope="col">SharedNIC</th>
          <th scope="col">NVME</th>
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
        </tr>
      </tbody>
    </table>
  );
}

export default SiteResourceTable ;
