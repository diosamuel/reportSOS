import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents, CircleMarker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import location_danger from '../../assets/location_danger.png';
import { useEffect, useState, useRef } from 'react';
import noimage from '../../assets/noimage.jpg';
import { useNavigate } from 'react-router-dom';
async function GetOverpass(geo) {
  let distanceInKm = 5;
  let [lat, lon] = geo;
  const latDegreeToKm = 111;
  const lonDegreeToKm = 111 * Math.cos((lat * Math.PI) / 180);
  const latOffset = distanceInKm / latDegreeToKm;
  const lonOffset = distanceInKm / lonDegreeToKm;
  const south = Number(lat) - latOffset;
  const north = Number(lat) + latOffset;
  const west = Number(lon) - lonOffset;
  const east = Number(lon) + lonOffset;
  let SWNE = [south, west, north, east];
  let overpassQuery = `[out:json][timeout:25];
  nwr["amenity"~"^(hospital|fire_station|police)$"](${SWNE.join(',')});
  out geom;`;
  let result = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(overpassQuery),
  });

  let res = await result.json();
  return res;
}

async function GetLatestEmergency() {
  console.log(import.meta.env.VITE_API_URL);
  let result = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/report`);
  return result;
}

function readableTime(isoDate) {
  const date = new Date(isoDate);

  // Format the date
  const readableDate = date.toLocaleString('en-US', {
    weekday: 'long', // e.g., "Saturday"
    year: 'numeric', // e.g., "2024"
    month: 'long', // e.g., "November"
    day: 'numeric', // e.g., "23"
    hour: '2-digit', // e.g., "7 PM"
    minute: '2-digit', // e.g., "04"
    second: '2-digit', // e.g., "37"
    timeZoneName: 'short', // e.g., "GMT"
  });

  return readableDate;
}
const Admin = () => {
  let API_URL = 'http://localhost:3000/';
  const [nearbyStation, setNearbyStation] = useState(null);
  const [allEmergency, setAllEmergency] = useState(null);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [latlong, setLatLong] = useState(null);
  const [response, setResponse] = useState({
    status: 500,
  });
  const [lemurResponse, setLemurResponse] = useState(null);
  const mapRef = useRef(null);
  let navigate = useNavigate();
  useEffect(() => {
    GetLatestEmergency()
      .then((data) => data.json())
      .then((data) => {
        if (data.data.length > 0) {
          setAllEmergency(data);
          let { geolocation } = data.data[1];
          setLatLong(JSON.parse(geolocation));
          setAppLoading(false);
        } else {
          //default
          setLatLong([38.89796010583636, -77.03730229875413]);
          setAppLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setEmergencyLoading(false);
      });
  }, []);

  console.log(allEmergency);

  const flyToLocation = (latlong) => {
    const map = mapRef.current;
    map.flyTo([latlong[0], latlong[1]], 17, {
      duration: 2, // seconds
    });
  };

  async function emergencyReview(id) {
    try {
      let req = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/report/${id}`);
      let response = await req.json();
      let { lat, lon } = response.data.nominatim;
      let lemur = JSON.parse(response?.data?.assemblyai?.llm);
      (async () => {
        let stations = await GetOverpass([lat, lon]);
        setNearbyStation(stations);
        setLemurResponse(lemur);
        setResponse(response);
        setEmergencyLoading(false);
      })();
    } catch (err) {
      console.error(err);
      setEmergencyLoading(false);
    }
  }
  const dangerIcon = new L.Icon({
    iconUrl: location_danger,
    iconAnchor: [50, 50],
    iconSize: [50, 50],
    popupAnchor: [0, -50],
  });
  return (
    <>
      {appLoading ? (
        <div className="h-screen flex flex-col justify-center items-center">
          <div className="relative">
            <div className="absolute w-16 h-16 rounded-full bg-red-500 animate-ping"></div>
            <div className="relative w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-4xl">🚨</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Loading 🗺</h1>
          <p>If loading takes too long, refresh to update.</p>
        </div>
      ) : (
        <>
          <div className="fixed z-50 right-2/4 px-4 py-2 rounded-full text-red-600 font-bold top-3">
            <div className="absolute inset-0 bg-red-300 border border-red-600 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-red-300 border border-red-600 rounded-full"></div>
            <h1 className="relative">Listening to Emergency!</h1>
          </div>

          <div className="fixed z-50 left-0 px-4 py-2 rounded-full text-white top-20 w-1/4">
            <button className="bg-red-600 rounded-full p-2 text-sm" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </button>
            {allEmergency && (
              <>
                <h1 className="font-bold text-black mb-2 text-lg mt-5">Latest Emergency</h1>
                <div className="bg-blue-900 p-3 rounded-lg h-[30em] overflow-y-scroll">
                  {allEmergency?.data?.map((place, i) => {
                    if (place.status) {
                      return (
                        <div className="mb-4" key={i}>
                          <p className="text-sm">{readableTime(place.datetime)}</p>
                          <p className="font-bold">{place.title}</p>
                          <button
                            className="bg-red-600 px-2 py-1 rounded-full text-xs"
                            onClick={() => {
                              flyToLocation(JSON.parse(place.geolocation));
                              console.log('MOVED');
                            }}
                          >
                            Locate Me
                          </button>
                          <hr className="mt-2 opacity-10" />
                        </div>
                      );
                    }
                  })}
                </div>
              </>
            )}
          </div>
          <section className={`flex flex-col fixed z-50 right-0 shadow-2xl transition-all`}>
            <div className={`bg-blue-950 p-5 h-screen w-[35em] space-y-2 overflow-y-scroll ${response.status == 200 ? 'block' : 'hidden'}`}>
              <p className="p-3 rounded-md border opacity-40 text-white flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-alert-triangle"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                </svg>
                Beware of disturbing picture
              </p>
              <p className="text-white text-sm bg-red-400/20 p-1 px-3 rounded-lg border border-red-300 w-fit">
                {readableTime(response?.datetime)}
              </p>
              <img
                className="rounded-lg w-full"
                src={`${import.meta.env.VITE_API_URL}/${response?.image}`}
                onError={(e) => (e.target.src = noimage)}
              />
              {/* <p>{`${import.meta.env.VITE_API_URL}/${place.image}`}</p> */}
              <img src={`${import.meta.env.VITE_API_URL}/${response.image}`} />
              <br />
              <div>
                <p className="text-white text-lg font-bold">{response?.data?.nominatim?.display_name}</p>
                <a href={`https://www.google.com/maps?q=${latlong?.join(',')}`} target="_blank" className="text-sm text-white underline">
                  Open Google Maps
                </a>
              </div>
              <br />
              <div className="flex gap-2">
                <div className="h-32 w-full bg-red-700 border text-white flex flex-col items-center justify-center text-center p-5 rounded-lg">
                  <h1 className="text-lg">Status</h1>
                  <p className="text-3xl font-bold">{lemurResponse?.status}</p>
                </div>
                <div className="h-32 w-full bg-red-800 border text-white p-2 rounded-lg text-center flex flex-col items-center justify-center">
                  <h1 className="text-lg">Accident</h1>
                  <p className="font-bold">{lemurResponse?.activities}</p>
                </div>
                <div className="flex flex-col justify-center h-32 w-full bg-transparent text-center text-white border p-3 rounded-lg">
                  <h1 className="text-lg">Casualty</h1>
                  <h1 className="">{lemurResponse?.casualty}</h1>
                </div>
              </div>
              <div className="w-full">
                <p className="font-semibold text-xl my-3 text-white">Voice Recording</p>
                <audio
                  className="w-full h-22 bg-gray-100 rounded-t-md"
                  controls
                  autoPlay
                  src={`${import.meta.env.VITE_API_URL}/${response?.audio}`}
                >
                  Your browser does not support the audio element.
                </audio>
                <div className="flex flex-col p-2 w-full bg-red-800 text-sm rounded-b-xl text-white">
                  <strong>Tone: {lemurResponse?.tone}</strong>
                </div>
              </div>
              <div className="text-white space-y-3 h-fit overflow-y-auto">
                <p className="text-sm">{response?.data?.assemblyai?.transcribe?.text}</p>
              </div>
              <br />
              <div className="bg-white p-3 rounded-lg space-y-3">
                <p className="text-xl font-bold">Key Points</p>
                <ul className="list-disc ml-5">
                  {lemurResponse?.key_points.map((key, i) => (
                    <li key={i}>{key}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg space-y-2">
                <p className="text-xl font-bold">Summary</p>
                <p>{lemurResponse?.summary}</p>
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold my-4">Nearby Emergency Station</h1>
                <div className="flex items-center w-full gap-3 text-center">
                  {nearbyStation && (
                    <>
                      <div className="p-5 w-full bg-blue-300/20 rounded">
                        <h1 className="text-xl">{nearbyStation.elements.filter((place) => place.tags.amenity == 'police').length}</h1>
                        <p>Police Station</p>
                      </div>
                      <div className="p-5 w-full bg-blue-300/20 rounded">
                        <h1 className="text-xl">{nearbyStation.elements.filter((place) => place.tags.amenity == 'fire_station').length}</h1>
                        <p>Fire Station</p>
                      </div>
                      <div className="p-5 w-full bg-blue-300/20 rounded">
                        <h1 className="text-xl">{nearbyStation.elements.filter((place) => place.tags.amenity == 'hospital').length}</h1>
                        <p>Hospital</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-3 p-4 border border-white/20 rounded overflow-y-auto h-64">
                  {nearbyStation &&
                    nearbyStation.elements.map((place, i) => (
                      <div key={i}>
                        <p className="font-bold">{place.tags.name}</p>
                        <p className="text-sm">{place.tags.amenity}</p>
                        {place.lat && (
                          <>
                            <p>
                              {place.lat}, {place.lon}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button
                                className="bg-red-600 px-3 py-2 rounded-full text-sm"
                                onClick={() => {
                                  flyToLocation([place.lat, place.lon]);
                                }}
                              >
                                Locate Me
                              </button>
                            </div>
                          </>
                        )}
                        <hr className="opacity-5 mt-4" />
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full space-y-2">
                <button className="bg-red-700 rounded-full w-full p-3 text-white">Accept Emergency</button>
              </div>
            </div>
          </section>
          <section className="h-screen">
            {latlong && (
              <MapContainer center={latlong} zoom={15} className="w-full h-full relative" style={{ zIndex: 1 }} ref={mapRef}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {allEmergency?.data?.map((place, i) => {
                  return (
                    <Marker position={JSON.parse(place.geolocation)} icon={dangerIcon} key={i}>
                      <Popup>
                        <div className="bg-red-200 text-red-600 border border-red-600 p-1 w-fit rounded-md mb-2">{place.datetime}</div>
                        <h1>{place.title}</h1>
                        <img
                          className="rounded-lg"
                          src={`${import.meta.env.VITE_API_URL}/${place.image}`}
                          onError={(e) => (e.target.src = noimage)}
                        />
                        <button
                          className={`w-full ${emergencyLoading ? 'bg-red-200' : 'bg-red-600'} text-white p-3 rounded-full mt-4`}
                          onClick={() => {
                            emergencyReview(place.id);
                            setEmergencyLoading(true);
                          }}
                          disabled={!!emergencyLoading}
                        >
                          {emergencyLoading ? (
                            <span className="flex gap-3 justify-center items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icon icon-tabler icons-tabler-outline icon-tabler-loader-2 animate-spin"
                              >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 3a9 9 0 1 0 9 9" />
                              </svg>
                              Loading
                            </span>
                          ) : (
                            'View Emergency'
                          )}
                        </button>
                      </Popup>
                    </Marker>
                  );
                })}
                {nearbyStation &&
                  nearbyStation.elements.map((place, i) => {
                    if (place.type == 'node') {
                      return (
                        <CircleMarker
                          key={i}
                          center={[place.lat, place.lon]}
                          radius={10}
                          pathOptions={{
                            fillColor:
                              place.tags.amenity === 'hospital'
                                ? 'lightblue'
                                : place.tags.amenity === 'fire_station'
                                  ? 'red'
                                  : place.tags.amenity === 'police'
                                    ? 'orange'
                                    : 'white',
                            color:
                              place.tags.amenity === 'hospital'
                                ? 'lightblue'
                                : place.tags.amenity === 'fire_station'
                                  ? 'red'
                                  : place.tags.amenity === 'police'
                                    ? 'orange'
                                    : 'white',
                            fillOpacity: 0.5,
                          }}
                        >
                          <Popup>
                            <p className="bg-red px-2 py-1 w-fit bg-red-200 rounded border-2 border-red-400">{place.tags.amenity}</p>
                            <h1 className="text-lg font-bold">{place.tags.name}</h1>
                            <p>{place.tags?.street}</p>
                            <a href={`https://www.google.com/maps?q=${[place.lat, place.lon]}`} target="_blank" className="underline">
                              Open Google Maps
                            </a>
                          </Popup>
                        </CircleMarker>
                      );
                    } else if (place.type == 'way') {
                      return (
                        <CircleMarker
                          center={[place.geometry[0].lat, place.geometry[0].lon]}
                          radius={10}
                          pathOptions={{
                            fillColor:
                              place.tags.amenity === 'hospital'
                                ? 'lightblue'
                                : place.tags.amenity === 'fire_station'
                                  ? 'red'
                                  : place.tags.amenity === 'police'
                                    ? 'orange'
                                    : 'white',
                            color:
                              place.tags.amenity === 'hospital'
                                ? 'lightblue'
                                : place.tags.amenity === 'fire_station'
                                  ? 'red'
                                  : place.tags.amenity === 'police'
                                    ? 'orange'
                                    : 'white',
                            fillOpacity: 0.5,
                          }}
                        >
                          <Popup>
                            <p className="bg-red px-2 py-1 w-fit bg-red-200 rounded border-2 border-red-400">{place.tags.amenity}</p>
                            <h1 className="text-lg font-bold">{place.tags.name}</h1>
                            <p>{place.tags?.street}</p>
                            <a href={`https://www.google.com/maps?q=${[place.lat, place.lon]}`} target="_blank" className="underline">
                              Open Google Maps
                            </a>
                          </Popup>
                        </CircleMarker>
                      );
                    }
                  })}
              </MapContainer>
            )}
          </section>
        </>
      )}
    </>
  );
};
export default Admin;
