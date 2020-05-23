import React, { useState } from "react";
import { Button, Image, List, Transition } from "semantic-ui-react";

const originList = [];
const productList = ["ade", "chris", "christian", "daniel", "elliot", "helen"];

const ListGroup = ()=> {
  const [product,setProduct]=useState(originList);

  const handleAdd = () =>{
    setProduct(originList);
  }

  const handleRemove = () =>{
    setProduct(productList);
  }

  return (
    <div>
      <Button.Group>
        <Button
          disabled={product.length === 0}
          icon="minus"
          onClick={handleRemove}
        />
        <Button
          disabled={items.length === users.length}
          icon="plus"
          onClick={handleAdd}
        />
      </Button.Group>

      <Transition.Group
        as={List}
        duration={200}
        divided
        size="huge"
        verticalAlign="middle"
        style={{ overflow: "auto", maxHeight: 200 }}
      >
        {items.map(item => (
          <List.Item key={item}>
            <Image
              avatar
              src={`https://react.semantic-ui.com/images/avatar/small/${item}.jpg`}
            />
            <List.Content header={_.startCase(item)} />
            <List.Content floated="right">
              <Button>Add2</Button>
            </List.Content>
          </List.Item>
        ))}
      </Transition.Group>
      </div>
  );
  
}

export default ListGroup