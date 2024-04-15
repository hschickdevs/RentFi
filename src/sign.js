function Sign() {

  const handleLedger = () => {
    // TODO add function call to updateLeaseStatus from factory lease agreement
    // TODO add function call to activateLease
    window.location.href = '/ledger'; // Directly changing the URL
  };

  return (
      <div>
      <h1>Hello World!! SIGNING</h1>
      <button onClick={handleLedger}>Sign</button>
      </div>
  );
}

export default Sign;