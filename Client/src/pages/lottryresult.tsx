import React from "react";
import BottomNav from "../components/Header";
import "../styles/victory.scss";

interface TableData {
  Time: number;
  Number: number;
  Amount: string;
  // : number;
  // amount: string;
  // status: string;
}

const App: React.FC = () => {
  const tableData: TableData[] = [
    // { sum: 19, scheme: 1, period: '20210504181', empty: 44, amount: '44', status: 'Activated' },
    // { sum: 18, scheme: 1, period: '20210504181', empty: 7, amount: '7', status: 'Activated' },
    // { sum: 17, scheme: 2, period: '20210504181', empty: 56, amount: '56', status: 'Activated' },
    // { sum: 16, scheme: 2, period: '20210504181', empty: 9, amount: '9', status: 'Activated' },
    // { sum: 15, scheme: 3, period: '20210504181', empty: 14, amount: '14', status: 'Activated' },
    // { sum: 14, scheme: 3, period: '20210504181', empty: 4, amount: '4', status: 'Activated' },
    // { sum: 13, scheme: 4, period: '20210504181', empty: 17, amount: '17', status: 'Activated' },
    // { sum: 12, scheme: 4, period: '20210504181', empty: 3, amount: '3', status: 'Activated' },
    // { sum: 11, scheme: 5, period: '20210504181', empty: 11, amount: '11', status: 'Activated' },
    // { sum: 10, scheme: 4, period: '20210504181', empty: 12, amount: '12', status: 'Activated' },
    // { sum: 9, scheme: 4, period: '20210504181', empty: 1, amount: '1', status: 'Activated' },
    // { sum: 8, scheme: 3, period: '20210504181', empty: 23, amount: '23', status: 'Activated' },
    // { sum: 7, scheme: 3, period: '20210504181', empty: 20, amount: '20', status: 'Activated' },
    // { sum: 6, scheme: 2, period: '20210504181', empty: 6, amount: '6', status: 'Activated' },
    // { sum: 5, scheme: 2, period: '20210504181', empty: 0, amount: '0', status: 'Activated' },
    // { sum: 4, scheme: 1, period: '20210504181', empty: 16, amount: '16', status: 'Activated' },
    // { sum: 3, scheme: 1, period: '20210504181', empty: 69, amount: '69', status: 'Activated' },
    // { sum: 2, scheme: 1, period: '20210504181', empty: 6, amount: '69', status: 'Activated' }
  ];

  return (
    <div className="app">
      {/* Header Section */}
      <div className="header">
        <h1>Lottry Result</h1>
      </div>

      {/* Tab Section */}
      <div className="tabs">
        {/* <button className="tab active">Plan</button>
        <button className="tab">Settings</button>
        <button className="tab">History</button>
        <button className="tab">Srpk10</button> */}
      </div>

      {/* Table Section */}
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>TIme</th>
              <th>Number</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.Time}</td>
                <td>{row.Number}</td>
                <td>{row.Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons Section */}
      {/* <div className="buttons">
        <button className="one-click-btn open">One-click open</button>
        <button className="one-click-btn close">One-click close</button>
      </div> */}
      <BottomNav />
    </div>
  );
};

export default App;
