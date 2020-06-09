import React , {useState , useEffect , useMemo} from 'react';
import { Dropdown} from "semantic-ui-react";
import {getDBCol} from "./firebase_";

const location = [
    { key: 'g1', value: 'g1', text: '1組' },
    { key: 'g2', value: 'g2', text: '2組' },
    { key: 'g3', value: 'g3', text: '3組' },
    { key: 'g4', value: 'g4', text: '4組' },
    { key: 'g5', value: 'g5', text: '5組' },
    { key: 'g6', value: 'g6', text: '6組' },
    { key: 'g7', value: 'g7', text: '7組' },
    { key: 'g8a', value: 'g8a', text: '8a組' },
    { key: 'g8b', value: 'g8b', text: '8b組' },
    { key: 'g9', value: 'g9', text: '9組' },
    { key: 'g10', value: 'g10', text: '10組' },
    { key: 'g11a', value: 'g11a', text: '11a組' },
    { key: 'g11b', value: 'g11b', text: '11b組' },
    { key: 'g12', value: 'g12', text: '12組' },
    { key: 'teacher', value: 'teacher', text: '教員室' },
    { key: 'computer', value: 'computer', text: '電腦室' },
    { key: 'housekeeping', value: 'housekeeping', text: '家政室' },
    { key: 'dt', value: 'dt', text: 'DT室' },
    { key: 'music', value: 'music', text: '音樂室' },
    { key: 'a_room', value: 'a_room', text: 'A仔室' },
    { key: 'st', value: 'st', text: 'ST室' },
    { key: 'ot', value: 'ot', text: '職業治療室' },
    { key: 'library', value: 'library', text: '圖書室' },
    { key: 'art', value: 'art', text: '視藝室' },
    { key: 'grow', value: 'grow', text: '成長坊' },
    { key: 'care', value: 'care', text: '治療室' },
    { key: 'hall', value: 'hall', text: '禮堂' },
  ]

const Location=()=>{

    const [location2,setLocation2]=useState([]);

    useEffect(()=>{
        console.log("inputLocation_Effect");
        setLocation2(getDBCol('location'));
        console.log(location2);
    },[]);

    return(
    <Dropdown placeholder='地點' options={location} fluid search selection />
    )
}

export default Location;