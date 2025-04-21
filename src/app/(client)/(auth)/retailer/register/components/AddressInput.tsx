import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { Field } from 'formik';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IoAlertCircle } from 'react-icons/io5';
import { Input, Loader } from 'rizzui';

export default function AddressInput({
  googleMapsApiKey,
  setSelectedLocation,
  setFieldValue,
  address,
}: {
  googleMapsApiKey: string;
  setSelectedLocation: any;
  setFieldValue: any;
  address: any;
}) {
  const t = useTranslations('RetailerBranches');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey, // Replace with your Google Maps API key
    libraries: ['places'], // Add 'places' library
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  const autocompleteRef = useRef<HTMLInputElement>(null);

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log('Geolocation not supported');
    }

    async function success(position: any) {
      if (!isLoaded) return; // Ensure the API is loaded
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setSelectedLocation({ lat: latitude, lng: longitude });

      try {
        const geocoder = new google.maps.Geocoder(); // Initialize geocoder
        const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });

        if (response.results && response.results.length > 0) {
          const address = response.results[0].formatted_address;

          setFieldValue('address', address);
          setFieldValue('latitude', String(latitude));
          setFieldValue('longitude', String(longitude));
        } else {
          console.log('No address found for this location.');
        }
      } catch (error) {
        console.error('Geocoder failed:', error);
      }
    }

    function error() {
      console.log('Unable to retrieve your location');
    }
  }, [isLoaded, setFieldValue, setSelectedLocation]);

  return isLoaded ? (
    <div className="w-full">
      <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
        <Field name="address">
          {({ field, meta }: { field: any; meta: any }) => (
            <Input
              className={`${meta.touched && meta.error ? 'mb-[-8px]' : 'mb-3'}`}
              onChange={handleInputChange}
              label={
                <span>
                  {t('address')} <span className="text-red-600">*</span>
                </span>
              }
              type="text"
              placeholder="Search for places..."
              ref={autocompleteRef}
              autoComplete="new-password"
              onFocus={(e) => {
                e.target.setAttribute('autocomplete', 'new-password');
              }}
              value={address}
              helperText={
                meta.touched && meta.error ? (
                  <div className="flex items-center gap-x-1">
                    <IoAlertCircle className="text-lg" />
                    <span>{meta.error}</span>
                  </div>
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
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <Loader variant="pulse" size="lg" />
      <Loader variant="pulse" size="lg" />
      <Loader variant="pulse" size="lg" />
    </div>
  );
}
