import React, { useState, useRef } from 'react';
import * as R from 'ramda';
import { checkItemNotReturn, getType } from "./lib/firebase_";
import { DataUsage } from '@material-ui/icons';
import { getFormatDate } from './lib/dateFormat';


const InputItemHook = (setError) => {
  const [itemsMap, setItemsMap] = useState(new Map());
  const _itemsMap = useRef(itemsMap);
  const refreshItemsMap = () => {
    setItemsMap(new Map(_itemsMap.current));
  }
  const addItemsMap = (key, value) => {
    _itemsMap.current.set(key, value);
    refreshItemsMap()
  }
  const removeItem = key => {
    if (_itemsMap.current.delete(key)) refreshItemsMap();
  }
  const resetItemsMap = () => setItemsMap(new Map());
  const createItemObject = (refno, type, desc = '', dbRefNo = '', returned = true) => ({ refno, type, desc, dbRefNo, returned });
  const checkType = data => {
    if (data) return data;
    throw new Error("沒有產品資料");
  }

  const addItem = async dataString => {
    try {
      const [desc, dbRefNo, returned = true] = await checkItemNotReturn(dataString);
      addItemsMap(dataString, createItemObject(dataString, checkType(await getType(dataString)), desc, dbRefNo, returned));

    } catch (err) {
      setError(err.message);
    }
  }
  return [addItem, removeItem, resetItemsMap, itemsMap]
}
//setItemsMap(new (Map));

export default InputItemHook;
