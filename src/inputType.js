import React , {useState , useEffect} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {getTypeCol} from './firebase_';

/*
const itemType = [
    { key: 'ipad', value: 'IPad', text: 'IPad' },
    { key: 'camera', value: '相機', text: '相機' },
    { key: 'notebook', value: '筆記本', text: '筆記本' },
  ]*/

const InputType = (props) =>{
    const [itemType,setItemType]=useState([]);

    useEffect(()=>{
        let mount = true;
        const getItemType = async ()=>{
            console.log("InputType_call_database");
            const querySnapshot=await getTypeCol('itemtype');
            if(mount){
                setItemType(querySnapshot.docs.map(doc=>{
                    return doc.data();
                }))
            }
        }
        getItemType();
        console.log("InputType_useEffect");
        return ()=>{
            mount=false;
            console.log("InputType_useEffect_Return");
        }
    },[])

    return (
        <Dropdown placeholder='種類' 
        fluid 
        search 
        selection 
        options={itemType} 
        onChange={(event, result) => { 
            props.setInputType(result.value)
            event.currentTarget.value === '' ? props.setInputTypeAlarm('visible') : props.setInputTypeAlarm('hidden');
            }} />
    )
}

export default InputType;
