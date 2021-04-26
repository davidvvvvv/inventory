import React, { useState, useRef } from 'react';
import { checkItemNotReturn, getType } from "./firebase_";


const ItemMapHook = (setError) => {
  const [itemsMap, setItemsMap] = useState(new Map());
  const _itemsMap = useRef(itemsMap);
  const refreshItemsMap = () => {
    setItemsMap(new Map(_itemsMap.current));
  }
  const addItemsMap = (key, value) => {
    _itemsMap.current.set(key, value);
    refreshItemsMap();
  }
  const removeItem = key => {
    if (_itemsMap.current.delete(key)) refreshItemsMap();
  }
  const resetItemsMap = () => setItemsMap(new Map());

  const addItem = async (dataString) => {
    try {
      addItemsMap(dataString, await createInputItemObject(dataString));
    } catch (err) {
      setError(err.message);
    }
  }
  return [addItem, removeItem, resetItemsMap, itemsMap]
}

const checkType = data => {
  if (data) return data;
  throw new Error("沒有產品資料");
}

const createItemObject = (refno, type, itemStatus) => ({refno , type , desc:itemStatus.desc, dbRefNo:itemStatus.dbRefNo, notYetReturned:itemStatus.returned});

/* create itemObject by inputForm.js*/
export const createInputItemObject = async dataString => {
  const itemStatus = await checkItemNotReturn(dataString);
  return createItemObject(dataString, checkType(await getType(dataString)), itemStatus);
}

export const createReturnObjet = async dataString =>{
  
}

export default ItemMapHook;