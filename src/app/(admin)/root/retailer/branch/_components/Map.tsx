import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { useFormikContext } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input, Loader } from 'rizzui';

export default function MapComponent() {
  const { setFieldValue, errors, touched, values }: any = useFormikContext();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA0VpTwpD1F3VWNpyKWT84EQHqTYraMyC4', // Replace with your Google Maps API key
    libraries: ['places'], // Add 'places' library
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral>({ lat: 23.7582377, lng: 90.3632155 });
  const autocompleteRef = useRef<HTMLInputElement>(null);

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
    const autocomplete = autocompleteRef.current;

    if (!autocomplete?.value) {
      setFieldValue('address', '');
      setFieldValue('longitude', '');
      setFieldValue('latitude', '');
    } else {
      setFieldValue('address', autocomplete.value);
    }
  };

  const onPlacesChanged = () => {
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
    if (values && values.latitude && values.longitude) {
      const newLocation = {
        lat: Number(values.latitude),
        lng: Number(values.longitude),
      };
      setSelectedLocation(newLocation);

      if (map) {
        map.panTo(newLocation);
      }
    }
  }, [map, values]);

  return isLoaded ? (
    <div>
      <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
        <Input
          value={values.address}
          ref={autocompleteRef}
          type="text"
          label={
            <span>
              Address <span className="text-red-600">*</span>
            </span>
          }
          placeholder="Search for places..."
          onChange={handleInputChange}
          name="address"
          error={errors.address && touched.address && <div className="mt-1 text-xs text-red-500">{errors.address}</div>}
          className="mb-3"
        />
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '400px',
        }}
        zoom={15}
        center={selectedLocation}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <Loader variant="pulse" size="lg" />
      <Loader variant="pulse" size="lg" />
      <Loader variant="pulse" size="lg" />
    </div>
  );
}
