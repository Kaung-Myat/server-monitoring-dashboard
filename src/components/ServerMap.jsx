import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ServerMap({ location }) {
  if (!location) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-bold text-lg mb-2">Server Location</h2>
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lon]}>
          <Popup>Server is here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
