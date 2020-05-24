import React, { useState, useMemo, useEffect } from "react";
import { Button, Image, List, Transition } from "semantic-ui-react";

const ListGroup = (props)=> {

  const items=props.list;
  const handleRemove = (index) =>{
   props.remove(index);
  }

  useEffect(()=>{
    console.log("listgroup_useEffect");
  },[]);

  return (
    <div>
      <Transition.Group
        as={List}
        duration={200}
        divided
        size="huge"
        verticalAlign="middle"
        style={{ overflow: "auto", maxHeight: 200 }}
      >
        {items.map((item,index) => (
          <List.Item key={item.ref}>
            <Image
              avatar
              src={`https://react.semantic-ui.com/images/avatar/small/ade.jpg`}
            />
            <List.Content header={item.ref} />
            <List.Content floated="right">
              <Button onClick={()=>handleRemove(index)}>移除</Button>
            </List.Content>
          </List.Item>
        ))}
      </Transition.Group>
      </div>
  );
  
}

export default ListGroup