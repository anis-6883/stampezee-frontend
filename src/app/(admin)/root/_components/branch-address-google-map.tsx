// 'use client';

// import { Map, GoogleApiWrapper, Marker } from 'google-map-react';

// const BranchAddressGoogleMap = (props) => {
//   const { location, style } = props;

//   const onChangePinLocation = async (coords) => {
//     try {
//       const result = await axios({
//         url: '/api/geocode-lat-lng',
//         method: 'POST',
//         data: {
//           lat: coords?.lat,
//           lng: coords?.lng,
//         },
//       });
//       setValue('location', result.data.results[0]);
//     } catch (error) {
//       enqueueSnackbar('Failed to determine the details of the location', {
//         variant: 'error',
//       });
//     }
//   };

//   const lat = location?.geometry?.location?.lat?.();
//   const lng = location?.geometry?.location?.lng?.();

//   return (
//     <Map
//       google={window.google}
//       zoom={17}
//       style={style}
//       center={{
//         lat,
//         lng,
//       }}
//       onClick={(props, map, event) => {
//         onChangePinLocation({
//           lat: event?.latLng?.lat?.(),
//           lng: event?.latLng?.lng?.(),
//         });
//         // console.log(event?.latLng?.lat?.());
//         // console.log(event?.latLng?.lng?.());
//       }}
//     >
//       {!!lat && !!lng && (
//         <Marker
//           position={{
//             lat,
//             lng,
//           }}
//         />
//       )}
//     </Map>
//   );
// };

// // Here we use GoogleApiWrapper() that we import of the package
// export default GoogleApiWrapper({
//   apiKey: process.env.NEXT_PUBLIC_MAP_API,
//   // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
// })(BranchAddressGoogleMap);

export default function BranchAddressGoogleMap() {
  return <div>branch-address-google-map</div>;
}
