// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import { useState } from 'react';

// const MapContainer = () => {
//   const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);

//   const handleMapClick = (e: google.maps.MapMouseEvent) => {
//     const { latLng }: { latLng: any } = e;
//     setSelectedLocation({
//       lat: latLng.lat(),
//       lng: latLng.lng(),
//     });
//   };
//   console.log(selectedLocation, 'selectedLocation');

//   const handlePlaceSelect = (place: google.maps.GeocoderResult) => {
//     // Handle place selection, update selected location
//   };

//   return (
//     <LoadScript googleMapsApiKey="">
//       <GoogleMap mapContainerStyle={{ width: '100%', height: '100vh' }} zoom={10} center={{ lat: 0, lng: 0 }} onClick={handleMapClick}>
//         {selectedLocation && <Marker position={selectedLocation} />}
//         {/* Add search functionality component */}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default MapContainer;

// v2
// import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
// import { useRef, useState } from 'react';

// const MapContainer = () => {
//   const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral>({ lat: 37.0902, lng: -95.7129 });
//   const autocompleteRef = useRef<HTMLInputElement>(null);
//   const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   const handleMapClick = (e: google.maps.MapMouseEvent) => {
//     const { latLng }: { latLng: any } = e;
//     setSelectedLocation({
//       lat: latLng.lat(),
//       lng: latLng.lng(),
//     });
//   };

//   const handlePlaceSelect = () => {
//     const autocomplete = autocompleteRef.current;
//     if (autocomplete && autocompleteService.current) {
//       autocompleteService.current.getPlacePredictions(
//         {
//           input: autocomplete.value,
//           componentRestrictions: { country: 'bd' }, // Limit search to Bangladesh
//           types: ['geocode'], // Only search for geographic locations
//         },
//         (predictions, status) => {
//           if (status === google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
//             const placeId = predictions[0].place_id;
//             const placesService = new google.maps.places.PlacesService(document.createElement('div'));
//             placesService.getDetails({ placeId }, (place, detailsStatus) => {
//               if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
//                 setSelectedLocation({
//                   lat: place.geometry.location.lat(),
//                   lng: place.geometry.location.lng(),
//                 });
//               }
//             });
//           }
//         }
//       );
//     }
//   };

//   const handleInputChange = () => {
//     const autocomplete = autocompleteRef.current;
//     if (autocomplete && autocompleteService.current) {
//       autocompleteService.current.getPlacePredictions(
//         {
//           input: autocomplete.value,
//           componentRestrictions: { country: 'bd' }, // Limit search to Bangladesh
//           types: ['geocode'], // Only search for geographic locations
//         },
//         (predictions, status) => {
//           if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
//             setSuggestions(predictions.map((prediction) => prediction.description));
//           } else {
//             setSuggestions([]);
//           }
//         }
//       );
//     }
//   };
//   console.log(selectedLocation, 'selectedLocation');
//   const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
//     // setSearchBox(ref);
//   };

//   const onPlacesChanged = () => {
//     // const places = searchBox?.getPlaces();
//     // if (places && places.length > 0) {
//     //   const place = places[0];
//     //   const location = place.geometry?.location;
//     //   if (location) {
//     //     const newCenter = {
//     //       lat: location.lat(),
//     //       lng: location.lng(),
//     //     };
//     //     setMarkerPosition(newCenter);
//     //     if (map) {
//     //       map.panTo(newCenter);
//     //     }
//     //   }
//     // }
//   };
//   return (
//     <div>
//       <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
//         <input
//           type="text"
//           placeholder="Search for places..."
//           style={{
//             boxSizing: `border-box`,
//             border: `1px solid transparent`,
//             width: `240px`,
//             height: `32px`,
//             padding: `0 12px`,
//             borderRadius: `3px`,
//             boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//             fontSize: `14px`,
//             outline: `none`,
//             textOverflow: `ellipses`,
//             position: 'absolute',
//             left: '50%',
//             marginLeft: '-120px',
//             top: '10px',
//           }}
//         />
//       </StandaloneSearchBox>
//       <LoadScript googleMapsApiKey="">
//         <GoogleMap mapContainerStyle={{ width: '100%', height: '100vh' }} zoom={10} center={selectedLocation} onClick={handleMapClick}>
//           {selectedLocation && <Marker position={selectedLocation} />}
//           <input
//             ref={autocompleteRef}
//             type="text"
//             placeholder="Search for a place"
//             style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
//             onChange={handleInputChange}
//           />
//           <ul style={{ position: 'absolute', top: 50, left: 10, zIndex: 1 }}>
//             {suggestions.map((suggestion, index) => (
//               <li
//                 key={index}
//                 onClick={() => {
//                   autocompleteRef.current!.value = suggestion;
//                   handlePlaceSelect();
//                 }}
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//           <button onClick={handlePlaceSelect} style={{ position: 'absolute', top: 10, left: 200, zIndex: 1 }}>
//             Search
//           </button>
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// };

// export default MapContainer;

// v3==========================================================================================================

// components/MapWithSearchBox.tsx
// import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
// import React, { useCallback, useRef, useState } from 'react';

// const containerStyle = {
//   width: '100%',
//   height: '400px',
// };

// const center = {
//   lat: -3.745,
//   lng: -38.523,
// };

// const MapContainer: React.FC = () => {
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: '', // Replace with your Google Maps API key
//     libraries: ['places'], // Add 'places' library
//   });

//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
//   const [markerPosition, setMarkerPosition] = useState(center);
//   const startTimeRef = useRef<number | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral>({ lat: 37.0902, lng: -95.7129 });
//   const autocompleteRef = useRef<HTMLInputElement>(null);
//   const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);

//   const onLoad = useCallback((map: google.maps.Map) => {
//     setMap(map);
//     map.addListener('click', logClick);
//     map.addListener('mousemove', logLag);
//   }, []);

//   const onUnmount = useCallback((map: google.maps.Map) => {
//     if (map) {
//       google.maps.event.clearListeners(map, 'click');
//       google.maps.event.clearListeners(map, 'mousemove');
//     }
//     setMap(null);
//   }, []);

//   const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
//     setSearchBox(ref);
//   };

//   const handleMapClick = (e: google.maps.MapMouseEvent) => {
//     const { latLng }: { latLng: any } = e;
//     setSelectedLocation({
//       lat: latLng.lat(),
//       lng: latLng.lng(),
//     });
//   };
//   const handleInputChange = () => {
//     const autocomplete = autocompleteRef.current;
//     if (autocomplete && autocompleteService.current) {
//       autocompleteService.current.getPlacePredictions(
//         {
//           input: autocomplete.value,
//           componentRestrictions: { country: 'bd' }, // Limit search to Bangladesh
//           types: ['geocode'], // Only search for geographic locations
//         },
//         (predictions, status) => {
//           if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
//             setSuggestions(predictions.map((prediction) => prediction.description));
//           } else {
//             setSuggestions([]);
//           }
//         }
//       );
//     }
//   };
//   const onPlacesChanged = () => {
//     const places = searchBox?.getPlaces();
//     if (places && places.length > 0) {
//       const place = places[0];
//       const location = place.geometry?.location;
//       if (location) {
//         const newCenter = {
//           lat: location.lat(),
//           lng: location.lng(),
//         };
//         setMarkerPosition(newCenter);
//         if (map) {
//           map.panTo(newCenter);
//         }
//       }
//     }
//   };

//   const logLag = async (event: google.maps.MapMouseEvent) => {
//     const currentTime = performance.now();
//     if (startTimeRef.current) {
//       const lag = currentTime - startTimeRef.current;
//       console.log(`Lag: ${lag}ms`);

//       await fetch('/api/log', {
//         // Updated URL
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ type: 'lag', data: { lag } }),
//       });
//     }
//     startTimeRef.current = currentTime;
//   };

//   const logClick = async (event: google.maps.MapMouseEvent) => {
//     console.log(`Map clicked at: ${event.latLng}`);

//     await fetch('/api/log', {
//       // Updated URL
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ type: 'click', data: { latLng: event.latLng } }),
//     });
//   };
//   console.log(selectedLocation, 'selectedLocation');
//   return isLoaded ? (
//     <div>
//       <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
//         <>
//           <input
//             type="text"
//             placeholder="Search for places..."
//             style={{
//               boxSizing: `border-box`,
//               border: `1px solid red`,
//               width: `240px`,
//               height: `32px`,
//               padding: `0 12px`,
//               borderRadius: `3px`,
//               boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//               fontSize: `14px`,
//               outline: `none`,
//               textOverflow: `ellipses`,
//               marginLeft: '0px',
//             }}
//           />
//         </>
//       </StandaloneSearchBox>
//       <GoogleMap mapContainerStyle={{ width: '100%', height: '50vh' }} zoom={10} center={selectedLocation} onClick={handleMapClick}>
//         {selectedLocation && <Marker position={selectedLocation} />}
//       </GoogleMap>
//     </div>
//   ) : (
//     <></>
//   );
// };

// export default MapContainer;

// v4===============================

import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from 'rizzui';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = ({ setFieldValue, errors, touched, address = '', update = false, locationData = null }: any) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA0VpTwpD1F3VWNpyKWT84EQHqTYraMyC4', // Replace with your Google Maps API key
    libraries: ['places'], // Add 'places' library
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral>({ lat: 37.0902, lng: -95.7129 });
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    console.log('handleMapClick');

    const { latLng }: { latLng: any } = e;

    setSelectedLocation({
      lat: latLng.lat(),
      lng: latLng.lng(),
    });
    setFieldValue('latitude', String(latLng.lat()));
    setFieldValue('longitude', String(latLng.lng()));
    if (map) {
      map.panTo(latLng); // Pan the map to the selected location
    }
  };

  const handleInputChange = () => {
    console.log('handleInputChange');

    const autocomplete = autocompleteRef.current;
    if (autocomplete && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: autocomplete.value,
          componentRestrictions: { country: 'bd' }, // Limit search to Bangladesh
          types: ['geocode'], // Only search for geographic locations
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.map((prediction) => prediction.description));
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  };

  const onPlacesChanged = () => {
    console.log('onPlacesChanged');

    const places = searchBox?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry?.location;
      const address = place.formatted_address;
      if (location) {
        const newLocation = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setSelectedLocation(newLocation);
        setFieldValue('latitude', String(newLocation.lat));
        setFieldValue('longitude', String(newLocation.lng));
        setFieldValue('address', address);
        if (map) {
          map.panTo(newLocation);
        }
      }
    }
  };

  useEffect(() => {
    if (update && locationData) {
      // setSelectedLocation({
      //   lat: Number(locationData.latitude),
      //   lng: Number(locationData.longitude),
      // });
      // console.log(locationData.lat, locationData.lng);

      if (locationData) {
        const newLocation = {
          lat: Number(locationData.latitude),
          lng: Number(locationData.longitude),
        };
        setSelectedLocation(newLocation);
        // setFieldValue('latitude', String(newLocation.lat));
        // setFieldValue('longitude', String(newLocation.lng));
        if (map) {
          map.panTo(newLocation);
        }
      }
    }
  }, [update, locationData, setSelectedLocation, map]);

  return isLoaded ? (
    <div>
      <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
        <>
          <Input
            ref={autocompleteRef}
            type="text"
            label="Address"
            placeholder="Search for places..."
            onChange={handleInputChange}
            className="mb-4"
            name="address"
            defaultValue={address}
          />
          {errors && touched && <div className="mt-1 text-xs text-red-500">{errors}</div>}
        </>
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        center={selectedLocation}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default MapComponent;
