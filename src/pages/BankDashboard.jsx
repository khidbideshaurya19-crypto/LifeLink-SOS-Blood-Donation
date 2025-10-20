function BankDashboard() {
  return (
    <div>
      <h2>🏦 Blood Bank Dashboard</h2>

      <h3>Stock</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Blood Group</th><th>Units</th></tr>
        </thead>
        <tbody>
          <tr><td>A+</td><td>10</td></tr>
          <tr><td>O-</td><td>4</td></tr>
        </tbody>
      </table>

      <h3>SOS Requests</h3>
      <p>Request R101: Need A+ 2 units (Urgency: High)</p>
      <button>Accept</button> <button>Reject</button>
    </div>
  );
}

export default BankDashboard;

