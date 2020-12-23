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
  const resetItemsMap = ()=> setItemsMap(new Map());

  const addItem = async dataString => {
    try {
      const createItemObject = (refno, type) => ({ 'refno': refno, 'type': type, 'desc': '', 'dbRefNo': '' });
      const checkType = data => {
        if (data) return data;
        throw new Error("沒有產品資料");
      }
      const filterFunction = item => item.refno === dataString;
      const filterCurry = R.filter(filterFunction);
      const foreachCurry = R.forEach(item => {
        item.desc = ` /未歸還: ${dbRecord.data().borrower} (${getFormatDate(dbRecord.data().borrow_date.toDate())})`;
        item.dbRefNo = ` ** ${dbRecord.id}`;
        console.log(dbRecord.id);
      });

      addItemsMap(dataString, createItemObject(dataString, checkType(await getType(dataString))));
      const dbRecord = await checkItemNotReturn(dataString);
      if (dbRecord) {
        filterCurry(_itemsMap.current)
        foreachCurry(_itemsMap.current);
        refreshItemsMap();
      }
    } catch (err) {
      setError(err.message);
    }
  }
  return [addItem, removeItem,resetItemsMap, itemsMap]
}
//setItemsMap(new (Map));

export default InputItemHook;
