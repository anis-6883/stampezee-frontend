import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { Field, useFormikContext } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input, Loader } from 'rizzui';

export default function MapComponent() {
  const { setFieldValue, values }: any = useFormikContext();
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
        <Field name="address">
          {({ field, meta }: { field: any; meta: any }) => (
            <Input
              className="mb-3"
              onChange={handleInputChange}
              label={
                <span>
                  Address <span className="text-red-600">*</span>
                </span>
              }
              type="text"
              placeholder="Search for places..."
              ref={autocompleteRef}
              value={values.address}
              inputClassName={`${meta.touched && meta.error ? '!border-red-500 !ring-0' : 'border-gray-200 !ring-0'}`}
            />
          )}
        </Field>
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
