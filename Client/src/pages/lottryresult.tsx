// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import BottomNav from "../components/Header";
// import { addBet } from "../redux/reducer/betReducer";
// import { RootState } from "../redux/store";
// import "../styles/victory.scss";

// const App: React.FC = () => {
//   const { bet, number, amount } = useSelector(
//     (state: RootState) => state.betReducer
//   );
//   const intervalRef = useRef<number | null>(null);
//   const dispatch = useDispatch();

//   const generateRandomNumber = () => {
//     let num;
//     do {
//       num = Math.floor(Math.random() * 18) + 2;
//     } while (num === number);
//     return num;
//   };

//   const generateAndStoreRandomNumber = () => {
//     const newNumber = generateRandomNumber();

//     const newTime = new Date().toISOString();
//     let newAmount = amount;
//     if (number === 7 || number === 8 || number === 14 || number === 15)
//       newAmount += 0.09 * amount;
//     else if (number === 5 || number === 6 || number === 16 || number === 17)
//       newAmount += 0.06 * amount;
//     else if (number === 9 || number === 10 || number === 12 || number === 13)
//       newAmount += 0.12 * amount;
//     else if (number === 11) newAmount += 0.15 * amount;
//     else newAmount += 0.03 * amount;

//     dispatch(addBet({ number: newNumber, time: newTime, amount: newAmount  }));
//   };

//   useEffect(() => {
//     intervalRef.current = setInterval(generateAndStoreRandomNumber, 300 * 1000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [dispatch]);

//   return (
//     <div className="app">
//       {/* Header Section */}
//       <div className="header">
//         <h1>Lottry Result</h1>
//         <p>Bets are scheduled to be placed every 5 minutes. Countdown to the next placement!</p>
//       </div>

//       {/* Tab Section */}
//       <div className="tabs">
//         {/* <button className="tab active">Plan</button>
//         <button className="tab">Settings</button>
//         <button className="tab">History</button>
//         <button className="tab">Srpk10</button> */}
//       </div>

//       {/* Table Section */}
//       <div className="table-section">
//         <table>
//           <thead>
//             <tr>
//               <th>Time</th>
//               <th>Number</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bet
//               .slice()
//               .sort(
//                 (a, b) =>
//                   new Date(b.time).getTime() - new Date(a.time).getTime()
//               )
//               .map((row, index) => (
//                 <tr key={index}>
//                   <td>
//                     {new Date(row.time).toLocaleTimeString("en-US", {
//                       hour12: false,
//                     })}
//                   </td>
//                   <td>{row.number}</td>
//                   <td>{row.amount}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Buttons Section */}
//       {/* <div className="buttons">
//         <button className="one-click-btn open">One-click open</button>
//         <button className="one-click-btn close">One-click close</button>
//       </div> */}
//       <BottomNav />
//     </div>
//   );
// };

// export default App;
