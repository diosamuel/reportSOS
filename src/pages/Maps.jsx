import { useEffect, useState } from 'react';
import Layout from '../Layout';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet';
import location_danger from '../assets/location_danger.png';
import location_default from '../assets/location_default.png';
import { useGeolocated } from 'react-geolocated';
import L from 'leaflet';
import useDebounce from '../hook/useDebounce';
import { useNavigate } from 'react-router-dom';
import useReportStore from '../store/useReportStore';

function Maps() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [pos, setPos] = useState(null);
  const [newPosition, setNewPosition] = useState(null);
  const setGeolocation = useReportStore((state) => state.setGeolocation);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });
  const dangerIcon = new L.Icon({
    iconUrl: location_danger,
    iconAnchor: [50, 50],
    iconSize: [50, 50],
    popupAnchor: [0, -50],
  });

  const defaultIcon = new L.Icon({
    iconUrl: location_default,
    iconAnchor: [50, 50],
    iconSize: [50, 50],
    popupAnchor: [0, -50],
  });
  console.log(isGeolocationEnabled);
  useEffect(() => {
    if (coords?.latitude) {
      getAddressFromCoordinate(coords.latitude, coords.longitude);
    }
  }, [coords?.latitude]);

  let navigate = useNavigate();
  const reportDanger = () => {
    setGeolocation(pos);
    console.log('SENT\n', pos);
    navigate('/camera');
  };

  async function getAddressFromCoordinate(lat, lon) {
    const API_REVERSE = `https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lon}&zoom=18&layer=address&format=jsonv2`;
    try {
      const response = await fetch(API_REVERSE);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPos(data);
      return data;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  }

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setNewPosition(e.latlng);
      },
    });

    return newPosition ? (
      <Marker position={newPosition} icon={defaultIcon}>
        <Popup>
          <p>
            New Selected Location
            <br />
            {`Lat: ${newPosition.lat.toFixed(5)}, Lng: ${newPosition.lng.toFixed(5)}`}
          </p>
          <button
            className="px-3 py-1 bg-red-600 rounded-full text-white"
            onClick={() => getAddressFromCoordinate(newPosition.lat, newPosition.lng)}
          >
            Choose this
          </button>
        </Popup>
      </Marker>
    ) : null;
  };

  return !isGeolocationAvailable ? (
    <div className="h-screen flex flex-col justify-center items-center text-center font-semibold">
      <h1 className="text-xl">Sorry but you cant use Geolocation</h1>
      <h1>Your browser dont support it</h1>
      <button className="bg-red-600 px-5 py-2 rounded-full justify-end text-white shadow-lg" onClick={reportDanger}>
        Skip this step
      </button>
    </div>
  ) : !isGeolocationEnabled ? (
    <>
      <div className="h-screen flex flex-col justify-center items-center text-center font-semibold">
        <h1 className="text-xl">Geolocation is not enabled, please enable</h1>
        <button className="bg-red-600 px-5 py-2 rounded-full justify-end text-white shadow-lg" onClick={reportDanger}>
          Skip this step
        </button>
      </div>
    </>
  ) : coords ? (
    <>
      {pos && (
        <div className="shadow-lg text-sm fixed top-2 z-50 p-3 right-0 bg-white rounded-l-lg w-7/12 md:w-3/12">
          <h1 className="font-semibold">Current Position</h1>
          <p>{pos?.display_name}</p>
          <p>{pos?.type}</p>
          <hr className="my-2" />
          <h1 className="font-semibold">New Position</h1>
          <span>{newPosition?.lat.toFixed(4)}, </span>
          <span>{newPosition?.lng.toFixed(4)}</span>
        </div>
      )}

      <div className="fixed z-50 left-16 top-4 md:top-[1.5em]">
        <h1 className="md:text-3xl md:w-40 text-lg w-20 font-bold">Find your Location</h1>
      </div>
      <div className="gap-2 w-4/12 md:w-2/12 flex flex-col fixed z-50 right-0 top-[15em] shadow-lg">
        <button
          className="flex gap-3 px-3 py-3 bg-white border rounded-l-md"
          onClick={() => getAddressFromCoordinate(coords.latitude, coords.longitude)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-gps"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M12 17l-1 -4l-4 -1l9 -4z" />
          </svg>{' '}
          Use GPS
        </button>
        <button
          className="flex gap-3 px-3 py-3 bg-white border rounded-l-md"
          onClick={() => getAddressFromCoordinate(newPosition.lat, newPosition.lng)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon icon-tabler icons-tabler-filled icon-tabler-flag"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z" />
          </svg>
          Choose
        </button>
        <button className="flex gap-3 px-3 py-3 rounded-l-md bg-red-600 text-white" onClick={reportDanger}>
          Proceed
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l14 0" />
            <path d="M15 16l4 -4" />
            <path d="M15 8l4 4" />
          </svg>
        </button>
      </div>
      {/* <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 w-9/12 md:w-6/12">
        <div className="w-full bg-white h-[50px] mb-2 rounded p-3">{query}</div>
        <input
          className="w-full rounded-full p-3 border border-black"
          placeholder="Search Location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div> */}
      <section className="h-screen">
        {pos && (
          <MapContainer center={[pos.lat, pos.lon]} zoom={25} className="w-full h-full relative" style={{ zIndex: 1 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[pos.lat, pos.lon]} icon={dangerIcon}>
              <Popup>
                <strong>Your Emergency Location</strong>
                <p>{pos?.display_name}</p>
              </Popup>
            </Marker>
            <LocationMarker />
          </MapContainer>
        )}
      </section>
    </>
  ) : (
    <></>
  );
}

export default Maps;
