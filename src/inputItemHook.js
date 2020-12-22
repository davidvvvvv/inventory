import React, { useState, useRef } from 'react';
import * as R from 'ramda';
import { checkItemNotReturn, getType } from "./lib/firebase_";
import { DataUsage } from '@material-ui/icons';
import {getFormatDate} from './lib/dateFormat';


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

  const createItemObject = (refno, type) => ({ 'refno': refno, 'type': type, 'desc': '', 'dbRefNo': '' });
  const checkType = data => {
    //console.log(`data1 ${data}`)
    if (data) return data;
    throw new Error("沒有產品資料");
  }

  const addItem =  async dataString => {
    try {
      //createItemObject(dataString, checkType(await getType(dataString)));
      addItemsMap(dataString, createItemObject(dataString, checkType(await getType(dataString))));
      //console.log(itemsMap);
      /*
      checkItemNotReturn(dataString).then(result => {
        if (result) {
          const [nonReturnDbRefNo, nonReturnItemRefno, nonReturnItemData] = result;
          console.log(nonReturnDbRefNo, nonReturnItemRefno, nonReturnItemData);
          _itemsMap.current.forEach(item => {
            if (item.refno == nonReturnItemRefno) {
              item.desc = ` /未歸還: ${nonReturnItemData.borrower} (${getFormatDate(nonReturnItemData.borrow_date.toDate())})`;
              item.dbRefNo = nonReturnDbRefNo;
            }
          })
          //const tempList = [..._itemsList.current];
          //setItemList(tempList);
          refreshItemsMap();
        }
      })*/
    } catch (err) {
      setError(err.message);
    }
  }

  return [addItem,removeItem,itemsMap]
}
//setItemsMap(new (Map));

export default InputItemHook;
