import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import location_danger from "../../assets/location_danger.png";
import emergencyCall from "./audio.mp3";
const Admin = () => {
  const dangerIcon = new L.Icon({
    iconUrl: location_danger,
    iconAnchor: [50, 50],
    iconSize: [50, 50],
    popupAnchor: [0, -50],
  });
  return (
    <>
      <section className="flex flex-col fixed z-50 right-0 shadow-lg">
        <div className="bg-blue-950 p-5 h-screen w-[40em] space-y-2 overflow-y-scroll">
          <p className="p-3 rounded-md border opacity-40 text-white">
            Beware of disturbing picture
          </p>
          <p className="text-white">Senin, 18/10/2024, 15:04:33</p>
          <p className="text-white">
            AAA Insurance, G Street Northwest, Downtown, Ward 2, Washington,
            District of Columbia, 20045, United States
          </p>
          <img
            className="rounded-lg"
            src="https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,q_auto:best,w_640/v1630583800/wwkp4kfnyavsjbb0bcze.jpg"
          />
          <div className="flex gap-2">
            <div className="h-44 w-full bg-red-700 border text-white flex items-center justify-center text-center p-5 rounded-lg text-3xl font-bold">
              Critical
            </div>
            <div className="h-44 w-full bg-red-800 border text-white p-5 rounded-lg text-center font-bold text-lg flex items-center justify-center">
              Mommy Fell Stairs
            </div>
            <div className="h-44 w-full bg-transparent text-center text-2xl font-bold text-white border p-5 rounded-lg">
              Gardner Road, Brunswick, GA 31523
            </div>
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
            <div className="flex flex-col p-2 w-full bg-orange-200 text-sm rounded-b-xl">
              <p>Tone: Urgent and concerned</p>
              <p>Female: 98%, Male: 2%</p>
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

          <div className="w-full space-y-2">
            <button className="bg-red-700 rounded-full w-full p-3 text-white">
              Accept Emergency
            </button>
            <button className="border border-red-700 rounded-full w-full p-3 text-white">
              Reject Emergency
            </button>
          </div>
        </div>
      </section>
      <section className="h-screen">
        <MapContainer
          center={[-5.3643342661897915, 105.31241514810489]}
          zoom={25}
          className="w-full h-full relative"
          style={{ zIndex: 1 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[-5.3643342661897915, 105.31241514810489]}
            icon={dangerIcon}
          >
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
                src="https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,q_auto:best,w_640/v1630583800/wwkp4kfnyavsjbb0bcze.jpg"
              />
              <button className="w-full bg-red-600 text-white p-3 rounded-full mt-4">
                Description
              </button>
            </Popup>
          </Marker>
        </MapContainer>
      </section>
    </>
  );
};
export default Admin;
