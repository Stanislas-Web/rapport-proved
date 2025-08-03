import { Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';

interface SchoolMapProps {
  etablissement: {
    nom: string;
    adresse: string;
    denomination?: {
      appellation: string,
      code: number,
      sigle: string
    }
    localisation?: {
      latitude: string | number;
      longitude: string | number;
    };
  };
}

const SchoolMap = ({ etablissement }: SchoolMapProps) => {
  const [showInfo, setShowInfo] = useState(false);

  // Default coordinates for Kinshasa if establishment coordinates are not available
  const defaultPosition = { lat: -4.3222096, lng: 15.2894846 };
  const position = etablissement.localisation ? {
    lat: parseFloat(String(etablissement.localisation.latitude)),
    lng: parseFloat(String(etablissement.localisation.longitude))
  } : defaultPosition;

  // Custom marker icon using SVG
  const schoolMarkerIcon = {
    path: 'M12 3L1 9l11 6l9-4.91V17h2V9L12 3z M10 14.17l-6-3.28V14l6 3l6-3v-3.11l-6 3.28z',
    fillColor: '#878787',
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#ffffff',
    scale: 1.5,
    // anchor: new google.maps.Point(12, 12),
  };

  return (
    // <Map
    //   style={{ width: '400px', height: '300px' }}
    //   center={position}
    //   zoom={15}
    //   gestureHandling={'greedy'}
    //   disableDefaultUI={false}
    // >
    //   <Marker
    //     position={position}
    //     icon={schoolMarkerIcon}
    //     onClick={() => setShowInfo(true)}
    //   />
    //   {showInfo && (
    //     <InfoWindow
    //       position={position}
    //       onCloseClick={() => setShowInfo(false)}
    //     >
    //       <div className="p-2">
    //         <h3 className="font-semibold text-gray-900">{etablissement.nom}</h3>
    //         <p className="text-sm text-gray-600 mt-1">{etablissement.adresse}</p>
    //       </div>
    //     </InfoWindow>
    //   )}
    // </Map>
    <Map
      style={{ width: '400px', height: '300px' }}
      center={position}
      zoom={15}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapTypeId="terrain" // Change to "roadmap", "hybrid", or "terrain" as needed
    >
      <Marker
        position={position}
        icon={schoolMarkerIcon}
        onClick={() => setShowInfo(true)}
      />
      {showInfo && (
        <InfoWindow   
          position={position}
          onCloseClick={() => setShowInfo(false)}
        >
          <div className="p-2 w-30">
            <h3 className="font-semibold text-gray-900">{etablissement.nom}</h3>
            <p className="text-xs text-gray-600 mt-1">{etablissement.adresse}</p>
          </div>
        </InfoWindow>
      )}
    </Map>

  );
};

export default SchoolMap;