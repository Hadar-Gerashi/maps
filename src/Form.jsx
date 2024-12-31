import "./form.css"
import { useState, useEffect } from "react";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import Spinner from './Spinner.jsx';
import UpdateMapCenter from "./UpdateMapCenter";
import { useForm } from 'react-hook-form'
import MenuComp from '../src/MenuComp'
import { fontSize } from "@mui/system";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';


export default function Form() {
    // מערך הכתובות שניתן לבחור בהשלמה אוטומטית לפי
    // הקלדת המשתמש במערך יש רק את שמות הרחובות ולא את כל האוביקט
    const [addresses, setAddresses] = useState([]);

    //משתנה ששומר את הaddress אבל ככל האוביקט ולא רק כשמות הרחובות בלבד
    let [data, setData] = useState([]);

    //הlat של הבחירה של כתובת המשתמש
    let [lat, setLat] = useState(30.8124247);

    //הlon של הבחירה של כתובת המשתמש
    let [lon, setLon] = useState(34.8594762);

    //משתנה לתצוגת הספינר חיפוש שלי 
    let [status, setStatus] = useState("");

    //השם של הכתובת שהמשתמש בחר
    let [name, setName] = useState("")

    //סטטוס חיפוש שהמורה ביקשה לאתחל אותו במחפש בהמשך נטפל בו
    let [statusSearch, setStatusSearch] = useState("מחפש")

    //משתנה בשביל תצוגת האיקון של תפריט שידע מתי להסגר ולהפתח
    let [menu, setMenu] = useState(false)

    //משתנים בשביל ה react-hook-form
    let { handleSubmit, register, formState: { isValid, errors }, getValues, setValue, reset } = useForm({ mode: "all" })




    //פונקציה שנעשת פעם אחת בעת טעינת הדף והיא נותנת את המיקום הנוכחי של המשתמש על המפה 
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLat(latitude);
                        setLon(longitude);
                        console.log(latitude)
                        console.log(longitude)

                    },
                    (err) => {
                        console.log(err.message);
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        };

        getLocation();
    }, []);



    //פונקציה בשביל האיקון תפריט  אם לוחץ עליו אז יפתח לי הטופס
    const handleClick = () => {
        setMenu(true); // משנה את הסטייט לערך ההפוך
    };



    //פונקציה לשמירת הערכים של הטופס בעת שליחה כרגע זה רק הדפסה ולא נעשה פה כלום
    const save = (values) => {
        alert(JSON.stringify(values))
        reset()
    }




    //פונקציה שמקבלת ערך שהמשתנה מקליד בהשלמה אוטומטית 
    //ומעדכן את משתנה מערך הרחובות לאופציות שניתן לו לבחור
    // לפי שליחה לfetch וקבלת האפשרויות מהapi
    async function nominatim_API(e) {

        try {
            data = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${e}&limit=5`);
            data = await data.json();
            setData([...data])
            let copy = [];
            data.forEach(item => {
                copy.push(item.display_name);
                setAddresses(copy)
            })
        }
        catch (err) {
            console.log(err)
        }
    }




    //פונקציה שמקבלת את מה שהמשתמש בחר ומחפשת את שם הכתובת הזו בdata אם מצא אז יעדכן את lat lon iname
    function getDetails(select) {
        let find = data.find(address => address.display_name == select)
        //אם לא קימת כתובת כזאת
        if
            (!find) { console.log("no have this city") }

        //אם קימת כתובת כזאת
        else {
            setLat(find.lat)
            setLon(find.lon)
            setName(find.display_name)
            setStatus("✅" + " נמצא")
        }

    }




    return (
        <div className="container">
            {/* //הצגת הקומפוננטה של איקון תפריט אם לא לחצו על איקון התפריט אן אם עשו איקס על הטופס */}
            {!menu && <MenuComp func={handleClick} />}

              {/* //הצגת הטופס רק אם לחצו על האיקון תפריט */}
            {menu && <div className="form-container">
                <form noValidate onSubmit={handleSubmit(save)}>

                    <button className="close" onClick={() => { setMenu(false) }}>x</button>

                    {/* {isValid ? <p>תקין</p> : <p>לא תקין</p>} */}
                    <div className="form-fields">
                        <label htmlFor="username">שם משתמש:</label>
                        <input className="inp" type="text" id="username" name="username" {...register("name", {
                            required: "שדה חובה"
                        })} />
                        {errors.name && <div className='div'>{errors.name.message}</div>}


                        <div className="spinner-container">
                            {status == "מחפש..." && <Spinner />}

                            <div >{status}</div>
                        </div>


                        <label htmlFor="username">כתובת:</label>
                        <Autocomplete
                            disablePortal



                            onInputChange={(e, select) => {

                                setStatus("מחפש...")
                                nominatim_API(e.target.value);
                                getDetails(select);


                            }}

                            options={addresses}
                            sx={{ width: "100%", '& .MuiInputBase-root': { height: 35 }, marginBottom: "30px" }}
                            renderInput={(params) => <TextField {...params} label="כתובת" sx={{ height: 35 }} {...register("address", {
                                required: "שדה חובה"
                            })} />}

                        />
                        {errors.address && <div className='div'>{errors.address.message}</div>}





                        <label htmlFor="phone">טלפון:</label>
                        <input className="inp" type="text" id="phone" name="phone"  {...register("phon", {
                            required: "שדה חובה",
                            pattern: {
                                value: /^(05\d{8}|03\d{7}|02\d{7}|04\d{7})$/,
                                message: "מספר טלפון לא תקין"
                            }
                        })} />
                        {errors.phon && <div className='div'>{errors.phon.message}</div>}




                        <label htmlFor="email">מייל:</label>
                        <input className="inp" type="email" id="email" name="email" {...register("email", {
                            required: "שדה חובה",  // שדה חובה
                            pattern: {
                                value: /^[A-Za-z0-9]{4,20}@gmail\.(co\.il|com)$/,  // תבנית המייל
                                message: "כתובת מייל לא תקינה"
                            }
                        })} />
                        {errors.email && <div className='div'>{errors.email.message}</div>}



                        <div className="checkbox-group">
                            <div>
                                <input type="checkbox" id="internet connection" name="internet connection" />
                                <label htmlFor="internet connection">חיבור לאנטרנט</label>
                            </div>
                            <div>
                                <input type="checkbox" id="kitchen" name="kitchen" />
                                <label htmlFor="kitchen">מטבח</label>
                            </div>
                            <div>
                                <input type="checkbox" id="coffee machine" name="coffee machine" />
                                <label htmlFor="coffee machine">מכונת קפה</label>
                            </div>
                        </div>


                        <label htmlFor="room-number">מספר חדרים:</label>
                        <input className="inp" type="number" id="room-number" name="room-number"  {...register("try", {
                            required: "שדה חובה",
                            min: { value: 1, message: "מספר חדרים נמוך מדי" },
                            max: { value: 20, message: "מספר חדרים גבוה מדי" }
                        })} />
                        {errors.try && <div className='div'>{errors.try.message}</div>}



                        <label htmlFor="distance">מרחק:</label>
                        <input className="inp" type="number" id="distance" name="distance" {...register("dis", {
                            required: "שדה חובה",
                            min: { value: 0, message: "מרחק נמוך מדי" }
                        })} />
                        {errors.dis && <div className='div'>{errors.dis.message}</div>}




                        <Button className="submit" style={{ direction: "ltr", height: "30px" }} endIcon={<SendIcon />} variant="contained" type="submit" disabled={!isValid}>
                            שליחה
                        </Button>





                    </div>
                </form>
            </div>}


            {/* התצוגה של המפה והמרקר */}
            <div className="map-container">
                <MapContainer center={[lat, lon]} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <UpdateMapCenter center={[lat, lon]} />


                    <Marker position={[lat, lon]}>
                        <Popup>
                            {name}
                            <br />

                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

