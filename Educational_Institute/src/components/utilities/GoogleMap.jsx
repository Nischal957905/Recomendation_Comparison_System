import { useState } from "react";
import Map, {Marker} from 'react-map-gl/mapbox'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as turf from '@turf/turf'

export default function GoogleMap({lat,long}){
    console.log(long)

    const apiKey = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

    let distanceOne = turf.point([27.7046882,85.3204163])
    let distanceTwo = turf.point([27.6178582,85.6263684])
    let options = {units: 'metres'};
    let distance = turf.distance(distanceOne, distanceTwo, options);  
     
    return (
        <div className="map-design-style">
            <Map
                mapboxAccessToken={apiKey}
                initialViewState={{
                    latitude: lat,
                    longitude: long,
                    zoom: 14
                }}
                style={{width: 600, height: 400}}
                mapStyle="mapbox://styles/nischal21/cllhdzjk9016x01pb1lj8ao4f"
            >
                <Marker latitude={lat} longitude={long}>
                    <LocationOnIcon/>
                </Marker>
            </Map>
        </div>
    )


}
