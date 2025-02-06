import React from 'react';

const LinkDetailTable = props => {
  const {from, to, data} = props;

  return (
    <div>
      <table className={`table resource-detail-table table-striped`}>
        <thead>
          <tr>
            <th scope="col" colSpan="2" className="text-center">
              {from} -&gt; {to}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className='font-monospace'>in</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link1.in}</span>
              <span className='font-monospace ms-1 text-sm-size'>bps</span>
            </td>
          </tr>
          <tr>
            <td><span className='font-monospace'>out</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link1.out}</span>
              <span className='font-monospace ms-1 text-sm-size'>bps</span>
            </td>
          </tr>
          <tr>
            <td><span className='font-monospace'>total</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link1.in + data.link1.out}</span>
              <span className='font-monospace ms-1 text-sm-size'>bps</span>
            </td>
          </tr>
          <tr>
            <td><span className='font-monospace'>max</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link1.max}</span> 
              <span className='font-monospace ms-1 text-sm-size'>bits</span>
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
          <tr>
            <td><span className='font-monospace'>in</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link2.in}</span>
              <span className='font-monospace ms-1 text-sm-size'>bps</span>
            </td>
          </tr>
          <tr>
            <td><span className='font-monospace'>out</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link2.out}</span>
              <span className='font-monospace ms-1 text-sm-size'>bps</span>
            </td>
          </tr>
          <tr>
            <td><span className='font-monospace'>total</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link2.in + data.link2.out}</span>
              <span className='font-monospace ms-1 text-sm-size'>bps</span>
            </td>
          </tr>
          <tr>
            <td><span className='font-monospace'>max</span></td>
            <td>
              <span className='font-monospace badge bg-primary'>{data.link2.max}</span> 
              <span className='font-monospace ms-1 text-sm-size'>bits</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default LinkDetailTable;
