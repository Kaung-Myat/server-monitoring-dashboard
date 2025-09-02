import { useEffect, useState } from "react";
import { fetchSystemData } from "../api/monitoringApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TaskManager() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    let controller;

    const fetchData = () => {
      controller = new AbortController();
      fetchSystemData(controller.signal)
        .then(setData)
        .catch((err) => {
          if (err.name !== "AbortError") setError(String(err));
        });
    };

    fetchData();
    intervalId = setInterval(fetchData, 5000);

    return () => {
      clearInterval(intervalId);
      if (controller) controller.abort();
    };
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      {data
        .slice()
        .reverse()
        .map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-6 border border-gray-200 space-y-4"
          >
            <h2 className="text-lg font-bold text-gray-800">
              {new Date(item.timestamp).toLocaleString()}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CPU */}
              <div className="p-4 border rounded-xl shadow-sm bg-blue-50 flex flex-col">
                <h3 className="font-semibold">CPU Usage</h3>
                <p className="text-xl">{item.cpu_usage}%</p>
                <div className="h-24 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.map((d) => ({
                        time: d.timestamp,
                        cpu: parseFloat(d.cpu_usage),
                      }))}
                    >
                      <Line type="monotone" dataKey="cpu" stroke="#2563eb" strokeWidth={2} dot={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Memory */}
              <div className="p-4 border rounded-xl shadow-sm bg-green-50 flex flex-col">
                <h3 className="font-semibold">Memory</h3>
                <p>
                  {item.memory.used} / {item.memory.total} MB (
                  {item.memory.percent}%)
                </p>
                <div className="h-24 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.map((d) => ({
                        time: d.timestamp,
                        memory: parseInt(d.memory.percent),
                      }))}
                    >
                      <Line type="monotone" dataKey="memory" stroke="#16a34a" strokeWidth={2} dot={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Disk */}
              <div className="p-4 border rounded-xl shadow-sm bg-yellow-50">
                <h3 className="font-semibold">Disk Usage</h3>
                <p>{item.disk_usage}</p>
              </div>

              {/* Services */}
              <div className="p-4 border rounded-xl shadow-sm bg-purple-50">
                <h3 className="font-semibold">Services</h3>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(item.services).map(([name, status]) => (
                    <li key={name}>
                      {name}:{" "}
                      <span
                        className={
                          status === "running" ? "text-green-600" : "text-red-600"
                        }
                      >
                        {status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default TaskManager;
