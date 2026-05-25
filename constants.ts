
import { Station, AnimalType, StationStatus, User, Veterinarian } from './types';

// Türkiye'nin 81 ili ve yaklaşık merkez koordinatları
const CITIES_DATA: {name: string, lat: number, lng: number}[] = [
  {name: "Adana", lat: 37.00167, lng: 35.32889}, {name: "Adıyaman", lat: 37.76389, lng: 38.27778}, 
  {name: "Afyonkarahisar", lat: 38.75694, lng: 30.54333}, {name: "Ağrı", lat: 39.7225, lng: 43.05306},
  {name: "Amasya", lat: 40.65, lng: 35.83333}, {name: "Ankara", lat: 39.93333, lng: 32.85},
  {name: "Antalya", lat: 36.90812, lng: 30.69556}, {name: "Artvin", lat: 41.18194, lng: 41.82083},
  {name: "Aydın", lat: 37.845, lng: 27.83917}, {name: "Balıkesir", lat: 39.64833, lng: 27.88278},
  {name: "Bilecik", lat: 40.1425, lng: 29.97944}, {name: "Bingöl", lat: 38.88472, lng: 40.49389},
  {name: "Bitlis", lat: 38.4, lng: 42.10833}, {name: "Bolu", lat: 40.735, lng: 31.60611},
  {name: "Burdur", lat: 37.72028, lng: 30.29083}, {name: "Bursa", lat: 40.18333, lng: 29.06667},
  {name: "Çanakkale", lat: 40.15528, lng: 26.41417}, {name: "Çankırı", lat: 40.6, lng: 33.61528},
  {name: "Çorum", lat: 40.55056, lng: 34.95556}, {name: "Denizli", lat: 37.77667, lng: 29.08639},
  {name: "Diyarbakır", lat: 37.91, lng: 40.24}, {name: "Edirne", lat: 41.67719, lng: 26.55944},
  {name: "Elazığ", lat: 38.67472, lng: 39.22306}, {name: "Erzincan", lat: 39.75, lng: 39.5},
  {name: "Erzurum", lat: 39.90861, lng: 41.27694}, {name: "Eskişehir", lat: 39.77667, lng: 30.52056},
  {name: "Gaziantep", lat: 37.06667, lng: 37.38333}, {name: "Giresun", lat: 40.9175, lng: 38.38778},
  {name: "Gümüşhane", lat: 40.46083, lng: 39.48167}, {name: "Hakkari", lat: 37.57444, lng: 43.74083},
  {name: "Hatay", lat: 36.2025, lng: 36.16056}, {name: "Isparta", lat: 37.76472, lng: 30.55667},
  {name: "Mersin", lat: 36.8121, lng: 34.6415}, {name: "İstanbul", lat: 41.0082, lng: 28.9784},
  {name: "İzmir", lat: 38.4127, lng: 27.1384}, {name: "Kars", lat: 40.60194, lng: 43.0975},
  {name: "Kastamonu", lat: 41.37806, lng: 33.77528}, {name: "Kayseri", lat: 38.73122, lng: 35.47873},
  {name: "Kırklareli", lat: 41.735, lng: 27.225}, {name: "Kırşehir", lat: 39.14583, lng: 34.16389},
  {name: "Kocaeli", lat: 40.85333, lng: 29.88139}, {name: "Konya", lat: 37.86667, lng: 32.48333},
  {name: "Kütahya", lat: 39.42417, lng: 29.98333}, {name: "Malatya", lat: 38.35528, lng: 38.30944},
  {name: "Manisa", lat: 38.6191, lng: 27.4289}, {name: "Kahramanmaraş", lat: 37.58583, lng: 36.93722},
  {name: "Mardin", lat: 37.31306, lng: 40.735}, {name: "Muğla", lat: 37.21806, lng: 28.36667},
  {name: "Muş", lat: 38.73444, lng: 41.49111}, {name: "Nevşehir", lat: 38.62444, lng: 34.71444},
  {name: "Niğde", lat: 37.96667, lng: 34.68333}, {name: "Ordu", lat: 40.98611, lng: 37.87972},
  {name: "Rize", lat: 41.02083, lng: 40.52389}, {name: "Sakarya", lat: 40.75694, lng: 30.37833},
  {name: "Samsun", lat: 41.29278, lng: 36.33139}, {name: "Siirt", lat: 37.93333, lng: 41.95},
  {name: "Sinop", lat: 42.02667, lng: 35.15111}, {name: "Sivas", lat: 39.75, lng: 37.01667},
  {name: "Tekirdağ", lat: 40.97806, lng: 27.51167}, {name: "Tokat", lat: 40.31667, lng: 36.55},
  {name: "Trabzon", lat: 41.005, lng: 39.72694}, {name: "Tunceli", lat: 39.10833, lng: 39.54722},
  {name: "Şanlıurfa", lat: 37.15833, lng: 38.79167}, {name: "Uşak", lat: 38.67417, lng: 29.40583},
  {name: "Van", lat: 38.5, lng: 43.38333}, {name: "Yozgat", lat: 39.81806, lng: 34.81472},
  {name: "Zonguldak", lat: 41.45056, lng: 31.79}, {name: "Aksaray", lat: 38.36861, lng: 34.03694},
  {name: "Bayburt", lat: 40.25528, lng: 40.22472}, {name: "Karaman", lat: 37.17583, lng: 33.22139},
  {name: "Kırıkkale", lat: 39.84167, lng: 33.50639}, {name: "Batman", lat: 37.88111, lng: 41.13028},
  {name: "Şırnak", lat: 37.51639, lng: 42.45944}, {name: "Bartın", lat: 41.63583, lng: 32.3375},
  {name: "Ardahan", lat: 41.11056, lng: 42.70222}, {name: "Iğdır", lat: 39.92361, lng: 44.045},
  {name: "Yalova", lat: 40.655, lng: 29.27694}, {name: "Karabük", lat: 41.2, lng: 32.63333},
  {name: "Kilis", lat: 36.71611, lng: 37.115}, {name: "Osmaniye", lat: 37.07417, lng: 36.24722},
  {name: "Düzce", lat: 40.83889, lng: 31.16389}
];

// DATA GENERATORS
const generateStations = (): Station[] => {
  const stations: Station[] = [];
  CITIES_DATA.forEach((city, cityIdx) => {
    for (let i = 1; i <= 3; i++) {
      const fill = Math.floor(Math.random() * 101);
      const status = fill > 50 ? StationStatus.GREEN : fill > 10 ? StationStatus.YELLOW : StationStatus.RED;
      const type = Math.random() > 0.5 ? AnimalType.CAT : AnimalType.DOG;
      
      stations.push({
        id: `st_${cityIdx}_${i}`,
        name: `${city.name} - ${i}. Pati Noktası`,
        city: city.name,
        location: { 
          latitude: city.lat + (Math.random() - 0.5) * 0.1, 
          longitude: city.lng + (Math.random() - 0.5) * 0.1 
        },
        address_full: `${city.name} Merkez, No:${i * 5}`,
        fillLevel: fill,
        type: type,
        lastUpdated: new Date().toISOString(),
        status: status
      });
    }
  });
  return stations;
};

const generateVets = (): Veterinarian[] => {
  const vets: Veterinarian[] = [];
  CITIES_DATA.forEach((city, cityIdx) => {
    for (let i = 1; i <= 3; i++) {
      vets.push({
        id: `vet_${cityIdx}_${i}`,
        name: `${city.name} ${i === 1 ? 'Merkez' : i === 2 ? 'Pati' : 'Can'} Veteriner Kliniği`,
        city: city.name,
        district: "Merkez",
        address_full: `${city.name} Çarşı Cad. No:${i * 12}`,
        location: { 
          latitude: city.lat + (Math.random() - 0.5) * 0.1, 
          longitude: city.lng + (Math.random() - 0.5) * 0.1 
        },
        type: i === 1 ? "7/24 Açık" : "Acil Servis"
      });
    }
  });
  return vets;
};

export const MOCK_USER: User = {
  id: 'user_123',
  displayName: 'Pati Dostu',
  points: 1250,
  totalFeedings: 24,
  location: { latitude: 41.0082, longitude: 28.9784 },
  transportation: 'walk'
};

export const INITIAL_STATIONS: Station[] = generateStations();
export const MOCK_VETS: Veterinarian[] = generateVets();

export const MOCK_VOLUNTEERS: User[] = [
  { id: 'v1', displayName: 'Deniz Aksu', points: 6450, location: { latitude: 41.0082, longitude: 28.9784 }, transportation: 'car' },
  { id: 'v2', displayName: 'Zeynep Yılmaz', points: 5200, location: { latitude: 41.0422, longitude: 28.9959 }, transportation: 'walk' },
  { id: 'v3', displayName: 'Burak Can', points: 4150, location: { latitude: 39.9333, longitude: 32.8597 }, transportation: 'car' },
  { id: 'v4', displayName: 'Selin Şahin', points: 3850, location: { latitude: 38.4237, longitude: 27.1428 }, transportation: 'walk' },
  { id: 'v5', displayName: 'Murat Demir', points: 3200, location: { latitude: 37.0662, longitude: 37.3833 }, transportation: 'car' },
  { id: 'v6', displayName: 'Elif Kaya', points: 2750, location: { latitude: 36.8841, longitude: 30.7056 }, transportation: 'walk' },
  { id: 'v7', displayName: 'Mert Aksoy', points: 2100, location: { latitude: 40.1885, longitude: 29.0610 }, transportation: 'car' },
  { id: 'v8', displayName: 'Aslı Güler', points: 1850, location: { latitude: 41.6772, longitude: 26.5594 }, transportation: 'walk' },
  { id: 'v9', displayName: 'Kerem Bulut', points: 1400, location: { latitude: 37.8714, longitude: 32.4921 }, transportation: 'car' },
  { id: 'v10', displayName: 'Pelin Aydın', points: 950, location: { latitude: 39.7767, longitude: 30.5206 }, transportation: 'walk' },
  { id: 'v11', displayName: 'Emre Yıldız', points: 600, location: { latitude: 41.0082, longitude: 28.9784 }, transportation: 'car' },
  { id: 'v12', displayName: 'Derya Öz', points: 450, location: { latitude: 38.7205, longitude: 35.4826 }, transportation: 'walk' }
];

export const FIRESTORE_SCHEMA_JSON = `{
  "stations": {
    "docId": "id",
    "fields": { "name": "string", "fillLevel": "number", "status": "string", "city": "string" }
  },
  "veterinarians": {
    "docId": "id",
    "fields": { "name": "string", "city": "string", "district": "string", "location": "geopoint" }
  }
}`;

export const ECO_MATCH_ALGORITHM = `
function calculateEcoMatch(user, station) {
  const distance = getDistance(user.location, station.location);
  const urgencyWeight = station.status === 'Red' ? 2 : 1;
  const transportBonus = user.transportation === 'walk' ? 1.5 : 1;
  return (100 / distance) * urgencyWeight * transportBonus;
}
`;

export const FLUTTER_FOLDER_STRUCTURE = `
lib/
  core/
  features/
    stations/
    vets/
    profile/
  shared/
`;

export const GEMINI_VISION_FLUTTER = `
// Integration with Google Generative AI for Flutter
final model = GenerativeModel(model: 'gemini-1.5-flash', apiKey: API_KEY);
final content = [Content.text(prompt), Content.data('image/jpeg', imageBytes)];
final response = await model.generateContent(content);
`;

export const PATIMAP_JSON_SCHEMA = {
  type: "object",
  properties: {
    stations: { type: "array" },
    vets: { type: "array" }
  }
};
