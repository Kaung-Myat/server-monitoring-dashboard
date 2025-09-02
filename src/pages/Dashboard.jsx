import { useEffect, useState } from "react";
import { fetchSystemData } from "../api/monitoringApi";
import CpuChart from "../components/CpuChart";
import MemoryChart from "../components/MemoryChart";
import ServerMap from "../components/ServerMap";
import ServiceStatus from "../components/ServiceStatus";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchData = () => {
      const controller = new AbortController();
      fetchSystemData(controller.signal)
        .then(setData)
        .catch((err) => {
          if (err.name !== "AbortError") setError(String(err));
        });
      return controller;
    };

    // fetch immediately
    let controller = fetchData();

    // fetch every 5 seconds
    intervalId = setInterval(() => {
      controller = fetchData();
    }, 5000);

    // cleanup
    return () => {
      clearInterval(intervalId);
      controller.abort(); // cancel last request
    };
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return <div>Loading...</div>;

  const latest = data[data.length - 1];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Server Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CpuChart data={data} />
        <MemoryChart data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServerMap location={latest.location} />
        <ServiceStatus services={latest.services} />
      </div>
    </div>
  );
}
