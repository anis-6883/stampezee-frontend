import Button from '@/components/Formik/Button';
import { Circle, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Loader, Modal, Title } from 'rizzui';

export default function MapModal({
  circle = false,
  radius,
  googleMapsApiKey,
  modalState,
  selectedLocation,
  setSelectedLocation,
  setFieldValue,
  setModalState,
}: {
  circle?: boolean;
  radius?: number;
  googleMapsApiKey: string;
  modalState: boolean;
  selectedLocation: any;
  setFieldValue: any;
  setSelectedLocation: any;
  setModalState: (state: boolean) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey, // Replace with your Google Maps API key
    libraries: ['places'], // Add 'places' library
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

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
        const components = response.results[0].address_components;

        // Helper to get component by type
        const getComponent = (type: string) => {
          const component = components.find((c) => c.types.includes(type));
          return component ? component.long_name : '';
        };

        const province = getComponent('administrative_area_level_1');
        const city = getComponent('locality') || getComponent('administrative_area_level_2');
        const postalCode = getComponent('postal_code');
        setFieldValue('address', address);
        setFieldValue('province', province);
        setFieldValue('city', city);
        setFieldValue('postalCode', postalCode);
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

  const defaultOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 2,
    fillOpacity: 0.05,
    strokeColor: '#DC3545',
    fillColor: '#DC3545',
    setDraggable: true,
  };

  return (
    <div>
      <Modal isOpen={modalState} onClose={() => setModalState(false)} customSize="970px">
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <Title as="h4">Map View</Title>

            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => {
                setModalState(false);
              }}
            >
              <IoCloseOutline className="text-2xl text-danger" />
            </ActionIcon>
          </div>
          {isLoaded ? (
            <div>
              <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '600px',
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
          )}

          <div className="mt-5 flex items-center justify-end">
            <Button
              color="danger"
              className="w-[130px]"
              type="button"
              text={'Save'}
              onClick={() => setModalState(false)}
              postIcon={<BsCheck2Circle className="text-base" />}
              // isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
