import { Menu } from "semantic-ui-react";
import React, { useState } from "react";

const UI_menu = () => {
  const [activeItem, setActiveItem] = useState("");
  const handleItemClick = event => {
    console.log(event.currentTarget.name);
  };

  return (
    <Menu>
      <Menu.Item
        name="editorials"
        active={activeItem === "editorials"}
        content="Editorials"
        onClick={handleItemClick}
      />

      <Menu.Item
        name="reviews"
        active={activeItem === "reviews"}
        content="Reviews"
        onClick={handleItemClick}
      />

      <Menu.Item
        name="upcomingEvents"
        active={activeItem === "upcomingEvents"}
        content="Upcoming Events"
        onClick={handleItemClick}
      />
    </Menu>
  );
};

export default UI_menu;
