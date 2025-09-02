export default function ServiceStatus({ services }) {
    if (!services) return null;
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-2">Services</h2>
        <ul className="space-y-1">
          {Object.entries(services).map(([name, status]) => (
            <li key={name} className="flex justify-between">
              <span>{name}</span>
              <span
                className={`font-semibold ${
                  status === "running" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  