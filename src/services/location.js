import { setDefaults, fromLatLng } from "react-geocode";

setDefaults({
    key: import.meta.env.VITE_GOOGLE_API_KEY,
    language: "th",
    region: "th"
});
  
export default function getCurrentAddress() {
const latitude = 18.796143;
const longitude = 98.979263;
    return new Promise((resolve, reject) => {
        // navigator.geolocation.getCurrentPosition(
        // (position) => {
        //     const { latitude, longitude } = position.coords;

            fromLatLng(latitude.toString(), longitude.toString())
            .then((response) => {
                const components = response.results[0].address_components;

                const provinceComponent = components.find((c) =>
                    c.types.includes("administrative_area_level_1")
                    );
                    const province = provinceComponent?.long_name || null;
                    resolve({ province });          
            })
        },
        (error) => {
            console.error("Geolocation error:", error);
            reject(error);
        }
        );
    // });
}
  