import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import leftLogo from "./assets/GOLDPE.png";
import rightLogo from "./assets/sss.png";


export default function App() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(300);

  const fetchData = async () => {
    try {
      setError(false);
      const res = await axios.get("http://localhost:8000/predict");
      setData(res.data);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          fetchData();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  if (error) return <h2>❌ Backend not running</h2>;
  if (!data) return <h2>Loading...</h2>;

  const today = data.today;
  const tomorrow = data.tomorrow;
  const trendUp = data.trend === "UP";

  return (
  <div className="container">

    <header className="header">
  <img src={leftLogo} className="logo" />

  <h1 className="title">Gold Price Predictor</h1>

  <img src={rightLogo} className="logo" />
  </header>


    <p className="timer">Next update in {timer}s</p>

    <div className="cards">

      {/* YESTERDAY */}
      <div className="card gray">
        <h3>Yesterday</h3>
        <p>24K ₹ {data.yesterday["24k"]}</p>
        <p>22K ₹ {data.yesterday["22k"]}</p>
        <p>18K ₹ {data.yesterday["18k"]}</p>
      </div>

      {/* TODAY */}
      <div className="card blue">
        <h3>Today</h3>
        <p>24K ₹ {data.today["24k"]}</p>
        <p>22K ₹ {data.today["22k"]}</p>
        <p>18K ₹ {data.today["18k"]}</p>
      </div>

      {/* TOMORROW */}
      <div className={`card ${trendUp ? "green" : "red"}`}>
        <h3>Tomorrow</h3>

        {["24k","22k","18k"].map(k => (
          <p key={k}>
            {k.toUpperCase()} ₹ {data.tomorrow[k].exact}
            <br/>
            Range ₹ {data.tomorrow[k].low} - {data.tomorrow[k].high}
          </p>
        ))}

        <h4>{trendUp ? "📈 UP" : "📉 DOWN"}</h4>
      </div>

    </div>

    <button className="refresh" onClick={fetchData}>Refresh</button>

  </div>
);
}
