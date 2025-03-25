import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import styled from 'styled-components';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ZoomControls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

const ZoomButton = styled.button`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  &:active {
    transform: scale(0.95);
  }
`;

const CardInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 1000;
`;

interface MapControllerProps {
  position: LatLngExpression;
  zoomLevel: number;
}

const MapController: React.FC<MapControllerProps> = ({ position, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoomLevel);
  }, [position, zoomLevel, map]);

  return null;
};

const MapView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [zoomLevel, setZoomLevel] = useState<number>(5);
  const [position, setPosition] = useState<LatLngExpression>([20.5937, 78.9629]); // Center of India

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setZoomLevel(10);
        },
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, []);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 1));

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <MapController position={position} zoomLevel={zoomLevel} />
      </MapContainer>

      <ZoomControls>
        <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
        <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
      </ZoomControls>

      <CardInfo>Card ID: {id}</CardInfo>
    </div>
  );
};

export default MapView;
