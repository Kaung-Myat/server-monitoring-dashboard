export async function fetchSystemData(signal) {
    const res = await fetch("http://192.168.1.17/system_health.json", { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
  
    return (json?.data ?? []).map((d) => ({
      ...d,
      cpu_usage: parseFloat(d.cpu_usage),
      memory: {
        ...d.memory,
        used: parseInt(d.memory.used, 10),
        total: parseInt(d.memory.total, 10),
        percent: parseInt(d.memory.percent, 10),
      },
      disk_usage: parseInt(d.disk_usage.replace("%", ""), 10),
      network_connections: parseInt(d.network_connections, 10),
      location: {
        lat: parseFloat(d.location.lat),
        lon: parseFloat(d.location.lon),
      },
    }));
  }
  