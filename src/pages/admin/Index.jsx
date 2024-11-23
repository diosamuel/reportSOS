import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
  CircleMarker,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import location_danger from "../../assets/location_danger.png";
import emergencyCall from "./audio.mp3";
import { useEffect, useState } from "react";
import stations from "./overpass.json";

async function GetOverpass(geo) {
  //radius 5 km
  let SW = geo.map((latlong) => latlong - 0.05);
  let NE = geo.map((latlong) => latlong + 0.05);
  let SWNE = [SW, NE];

  let overpassQuery = `[out:json][timeout:25];
  nwr["amenity"~"^(hospital|fire_station|police)$"](${SWNE.join(",")});
  out geom;`;

  let result = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(overpassQuery),
  });

  let res = await result.json();
  return res;
}

const Admin = () => {
  const [nearbyStation, setNearbyStation] = useState(null);
  const [latlong, setLatLong] = useState([
    38.897367324157926, -77.03646543098434,
  ]);
  useEffect(() => {
    setLatLong([38.897367324157926, -77.03646543098434]);
    setNearbyStation(stations);
    console.log(nearbyStation);
  }, []);
  const dangerIcon = new L.Icon({
    iconUrl: location_danger,
    iconAnchor: [50, 50],
    iconSize: [50, 50],
    popupAnchor: [0, -50],
  });
  return (
    <>
      <div className="fixed z-50 right-3/4 px-4 py-2 rounded-full text-white top-3">
        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping"></div>
        <div className="absolute inset-0 bg-red-600 rounded-full"></div>
        <h1 className="relative">Emergency Alert!</h1>
      </div>

      <section className="flex flex-col fixed z-50 right-0 shadow-2xl">
        <div className="bg-blue-950 p-5 h-screen w-[40em] space-y-2 overflow-y-scroll">
          <p className="p-3 rounded-md border opacity-40 text-white flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-alert-triangle"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
            </svg>
            Beware of disturbing picture
          </p>
          <img
            className="rounded-lg"
            src="https://www.ctvnews.ca/content/dam/ctvnews/en/images/2024/9/11/multi-vehicle-crash-1-7034426-1726089562682.png"
          />
          <div>
            <p className="text-white">Senin, 18/10/2024, 15:04:33</p>
            <p className="text-white">
              AAA Insurance, G Street Northwest, Downtown, Ward 2, Washington,
              District of Columbia, 20045, United States
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-44 w-full bg-red-700 border text-white flex flex-col items-center justify-center text-center p-5 rounded-lg">
              <h1 className="text-xl">Status</h1>
              <p className="text-3xl font-bold">Critical</p>
            </div>
            <div className="h-44 w-full bg-red-800 border text-white p-5 rounded-lg text-center flex flex-col items-center justify-center">
              <h1 className="text-xl">Accident</h1>
              <p className="text-3xl font-bold">Car Crash</p>
            </div>
            <div className="flex flex-col justify-between h-44 w-full bg-transparent text-center text-xl text-white border p-5 rounded-lg">
              <h1 className="font-bold">Gardner Road, Brunswick, GA 31523</h1>
              <a
                href={`https://www.google.com/maps?q=${latlong.join(",")}`}
                target="_blank"
                className="text-sm p-4 underline"
              >
                Open Maps
              </a>
            </div>
          </div>
          <div class="w-full">
            <p className="font-semibold text-xl my-3 text-white">
              Voice Recording
            </p>
            <audio
              class="w-full h-22 bg-gray-100 rounded-t-md"
              controls
              autoPlay
              src={emergencyCall}
            >
              Your browser does not support the audio element.
            </audio>
            <div className="flex flex-col p-2 w-full bg-red-800 text-sm rounded-b-xl text-white">
              <strong>Tone: Urgent and concerned</strong>
            </div>
          </div>
          <div className="text-white space-y-3 h-32 overflow-y-auto">
            <p className="text-sm">
              Ambulance service. Tell me exactly what's happened. Mummy fell
              down a. Stairs. Your mummy fell down the stairs? Sorry. She's got
              a baby. Did Mummy and the baby fall down the stairs at the same
              time? Yes. All right, my darling. We're gonna help Mummy, okay? So
              can you go up to your mummy for me? You're with Mummy, all right?
              Is Mummy breathing? Yes. Mummy's breathing, is she? Yes. All
              right, my lovely. Bear with me in second, okay? Stay on the phone.
              I'm not going to hang up the phone. Okay. How's the baby? In
              Mummy's tummy. The baby's in Mummy's tummy. Okay, sweetie. All
              right, my darling. That's okay. Do you know where Mummy's hurt?
              Where did Mummy hurt herself? Apart from her head? Is she hurt
              anywhere else? No. No. Okay. And has Mummy got her eyes open? Is
              she talking to you? Going back to sleep now. She's gone back to
              sleep now. Okay, but, Emma, the ambulance has come in, my lovely,
              so I'm going to stay on the phone with you, okay? Suicide. And I
              want you to watch your mummy and make sure that Mummy's breathing,
              okay? Do you know what that means?
            </p>
          </div>
          <br />
          <div className="bg-white p-3 rounded-lg space-y-3">
            <p className="text-xl font-bold">Emergency Key Points</p>
            <ul className="list-disc ml-5">
              <li>Caller identifies herself as Julia Murray</li>
              <li>Reports killing her 2 and 4 year old children by drowning</li>
              <li>States she then shot herself with a gun</li>
              <li>Requests ambulance to her address in Brunswick, GA</li>
              <li>911 operator attempts to keep her on the line</li>
              <li>Caller becomes unresponsive by end of call"</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg space-y-2">
            <p className="text-xl font-bold">Emergency Summary</p>
            <p>
              This is a disturbing 911 call transcript where a woman named Julia
              Murray reports that she has killed her two young children by
              drowning them and then shot herself. She requests an ambulance to
              her address in Brunswick, GA. The 911 operator tries to keep her
              on the line but she becomes unresponsive
            </p>
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold my-4">Nearby Emergency Station</h1>
            <div className="mt-3 p-4 border border-white/20 rounded overflow-y-auto h-44">
              {[...new Array(10)].map((x) => (
                <div>
                  <p className="font-bold">
                    Rumah Sakit Tingkat IV 02.07.04 DKT
                  </p>
                  <p className="text-sm">
                    Jalanr. Rivai No.7, Penengahan, Kec. Tanjung Karang Pusat,
                    Kota Bandar Lampung, Lampung
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-red-600 px-3 py-2 rounded-full text-sm">
                      Location
                    </button>
                    <button className="bg-red-600 px-3 py-2 rounded-full text-sm">
                      Call Service
                    </button>
                  </div>
                  <hr className="opacity-5 mt-4" />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full space-y-2">
            <button className="bg-red-700 rounded-full w-full p-3 text-white">
              Accept Emergency
            </button>
          </div>
        </div>
      </section>
      <section className="h-screen">
        <MapContainer
          center={latlong}
          zoom={15}
          className="w-full h-full relative"
          style={{ zIndex: 1 }}
        >
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" />
          <Marker position={latlong} icon={dangerIcon}>
            <Popup>
              <div className="bg-red-200 text-red-600 border border-red-600 p-1 w-fit rounded-md mb-2">
                Critical
              </div>
              <strong>Emergency Location</strong>
              <p>
                AAA Insurance, G Street Northwest, Downtown, Ward 2, Washington,
                District of Columbia, 20045, United States
              </p>

              <img
                className="rounded-lg"
                src="https://www.ctvnews.ca/content/dam/ctvnews/en/images/2024/9/11/multi-vehicle-crash-1-7034426-1726089562682.png"
              />
              <button className="w-full bg-red-600 text-white p-3 rounded-full mt-4">
                Description
              </button>
            </Popup>
          </Marker>

          {nearbyStation &&
            nearbyStation.elements.map((place) => {
              if (place.type == "node") {
                return (
                  <CircleMarker center={[place.lat, place.lon]} radius={10}>
                    <Popup>
                      <p className="bg-red px-2 py-1 w-fit bg-red-200 rounded border-2 border-red-400">
                        {place.tags.amenity}
                      </p>
                      <h1 className="text-lg font-bold">{place.tags.name}</h1>
                    </Popup>
                  </CircleMarker>
                );
              } else if (place.type == "way") {
                return (
                  <CircleMarker
                    center={[place.geometry[0].lat, place.geometry[0].lon]}
                    radius={10}
                  >
                    {" "}
                    <Popup>
                      <p className="bg-red px-2 py-1 w-fit bg-red-200 rounded border-2 border-red-400">
                        {place.tags.amenity}
                      </p>
                      <h1 className="text-lg font-bold">{place.tags.name}</h1>
                    </Popup>
                  </CircleMarker>
                );
              }
            })}
        </MapContainer>
      </section>
    </>
  );
};
export default Admin;
