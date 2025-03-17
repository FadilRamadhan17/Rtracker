"use client";
import { useEffect, useState } from "react";
import IbadahStats from "../components/IbadahStats";
import IbadahPointsChart from "../components/IbadahChart";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/ibadah")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <IbadahStats data={data} />
      {data && <IbadahPointsChart data={data} />}
    </div>
  );
};

export default Dashboard;
