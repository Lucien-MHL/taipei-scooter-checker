import L from 'leaflet'

export const MapPin = L.divIcon({
  html: '<div class="w-5 h-5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer"></div>',
  className: 'custom-station-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})
