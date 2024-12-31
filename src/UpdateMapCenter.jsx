import { useMap } from 'react-leaflet'


//קומפוננטה שמוזיזה את המפה לאן
// שהמרקר נמצא וכך המשתמש יוכל לדעת איפה הוא"נמצא" ך
const UpdateMapCenter = (prop) => {
    
  
    const map = useMap();
    map.setView(prop.center)
    return null
}

export default UpdateMapCenter