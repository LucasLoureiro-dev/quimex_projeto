"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrige o bug do Next com ícones
delete L.Icon.Default.prototype._getIconUrl;

// Ícone verde em SVG (inline, sem depender de imagem externa)
const greenMapIcon = new L.DivIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="#00cc66" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `,
  className: "",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

// ================================
// 📍 Pontos de Venda Quimex — Brasil inteiro
// ================================
const salesPoints = [
  // 🟩 Norte
  { name: "Manaus - AM", coords: [-3.1190, -60.0217] },
  { name: "Belém - PA", coords: [-1.4558, -48.4902] },
  { name: "Porto Velho - RO", coords: [-8.7608, -63.9039] },
  { name: "Rio Branco - AC", coords: [-9.9749, -67.8243] },
  { name: "Macapá - AP", coords: [0.0350, -51.0705] },
  { name: "Santarém - PA", coords: [-2.4385, -54.6996] },
  { name: "Boa Vista - RR", coords: [2.8235, -60.6758] },
  { name: "Marabá - PA", coords: [-5.3800, -49.1328] },
  { name: "Parintins - AM", coords: [-2.6283, -56.7350] },
  { name: "Ji-Paraná - RO", coords: [-10.8777, -61.9510] },

  // 🟦 Nordeste
  { name: "Salvador - BA", coords: [-12.9777, -38.5016] },
  { name: "Recife - PE", coords: [-8.0476, -34.8770] },
  { name: "Fortaleza - CE", coords: [-3.7319, -38.5267] },
  { name: "Natal - RN", coords: [-5.7945, -35.2110] },
  { name: "João Pessoa - PB", coords: [-7.1195, -34.8450] },
  { name: "Teresina - PI", coords: [-5.0892, -42.8019] },
  { name: "Aracaju - SE", coords: [-10.9472, -37.0731] },
  { name: "Maceió - AL", coords: [-9.6658, -35.7350] },
  { name: "Feira de Santana - BA", coords: [-12.2664, -38.9663] },
  { name: "Campina Grande - PB", coords: [-7.2307, -35.8814] },

  // 🟨 Centro-Oeste
  { name: "Brasília - DF", coords: [-15.7939, -47.8828] },
  { name: "Goiânia - GO", coords: [-16.6869, -49.2648] },
  { name: "Cuiabá - MT", coords: [-15.6014, -56.0979] },
  { name: "Campo Grande - MS", coords: [-20.4697, -54.6201] },
  { name: "Rondonópolis - MT", coords: [-16.4708, -54.6354] },
  { name: "Dourados - MS", coords: [-22.2231, -54.8120] },
  { name: "Anápolis - GO", coords: [-16.3285, -48.9534] },
  { name: "Sinop - MT", coords: [-11.8604, -55.5092] },
  { name: "Três Lagoas - MS", coords: [-20.7893, -51.7037] },
  { name: "Luziânia - GO", coords: [-16.2525, -47.9500] },

  // 🟧 Sudeste
  { name: "São Paulo - SP", coords: [-23.5505, -46.6333] },
  { name: "Rio de Janeiro - RJ", coords: [-22.9068, -43.1729] },
  { name: "Belo Horizonte - MG", coords: [-19.9167, -43.9345] },
  { name: "Vitória - ES", coords: [-20.3155, -40.3128] },
  { name: "Campinas - SP", coords: [-22.9056, -47.0608] },
  { name: "Santos - SP", coords: [-23.9535, -46.3350] },
  { name: "Juiz de Fora - MG", coords: [-21.7595, -43.3396] },
  { name: "Uberlândia - MG", coords: [-18.9186, -48.2772] },
  { name: "Volta Redonda - RJ", coords: [-22.5200, -44.0999] },
  { name: "Ribeirão Preto - SP", coords: [-21.1775, -47.8103] },

  // 🟥 Sul
  { name: "Curitiba - PR", coords: [-25.4284, -49.2733] },
  { name: "Porto Alegre - RS", coords: [-30.0346, -51.2177] },
  { name: "Florianópolis - SC", coords: [-27.5954, -48.5480] },
  { name: "Londrina - PR", coords: [-23.3045, -51.1696] },
  { name: "Joinville - SC", coords: [-26.3044, -48.8487] },
  { name: "Caxias do Sul - RS", coords: [-29.1678, -51.1794] },
  { name: "Blumenau - SC", coords: [-26.9200, -49.0653] },
  { name: "Maringá - PR", coords: [-23.4200, -51.9333] },
  { name: "Pelotas - RS", coords: [-31.7719, -52.3420] },
  { name: "Chapecó - SC", coords: [-27.1000, -52.6167] },
];

export default function QuimexMap() {
  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={[-14.235, -51.9253]} // centro aproximado do Brasil
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {salesPoints.map((point, idx) => (
          <Marker key={idx} position={point.coords} icon={greenMapIcon}>
            <Popup>
              <div className="text-center">
                <strong>{point.name}</strong>
                <p>Ponto de venda Quimex</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
