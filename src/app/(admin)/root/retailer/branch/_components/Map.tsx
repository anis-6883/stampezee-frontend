import { Circle, GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { Field, useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoAlertCircle } from 'react-icons/io5';
import { Input, Loader } from 'rizzui';

export default function MapComponent({
  circle = false,
  radius,
  googleMapsApiKey,
}: {
  circle?: boolean;
  radius?: number;
  googleMapsApiKey: string;
}) {
  const { setFieldValue, values }: any = useFormikContext();
  const t = useTranslations('RetailerBranches');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey, // Replace with your Google Maps API key
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

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!isLoaded) return; // Ensure the API is loaded

    const { latLng } = e;

    if (!latLng) return;

    const lat = latLng.lat();
    const lng = latLng.lng();

    setSelectedLocation({ lat, lng });
    setFieldValue('latitude', String(lat));
    setFieldValue('longitude', String(lng));

    try {
      const geocoder = new google.maps.Geocoder(); // Initialize geocoder
      const response = await geocoder.geocode({ location: { lat, lng } });

      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        setFieldValue('address', address);
      } else {
        console.log('No address found for this location.');
      }
    } catch (error) {
      console.error('Geocoder failed:', error);
    }

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

  const defaultOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 2,
    fillOpacity: 0.05,
    strokeColor: '#DC3545',
    fillColor: '#DC3545',
    setDraggable: true,
  };

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
                  {t('address')} <span className="text-red-600">*</span>
                </span>
              }
              type="text"
              placeholder="Search for places..."
              ref={autocompleteRef}
              value={values.address}
              helperText={
                meta.touched && meta.error ? (
                  <span className="flex items-center gap-x-1">
                    <IoAlertCircle className="text-lg" />
                    <span>{meta.error}</span>
                  </span>
                ) : (
                  ''
                )
              }
              helperClassName="text-danger"
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
        zoom={13}
        center={selectedLocation}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {selectedLocation && (
          <>
            <Marker position={selectedLocation} />
            {circle && radius && <Circle center={selectedLocation} radius={radius * 1000} options={defaultOptions} />}
          </>
        )}
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
