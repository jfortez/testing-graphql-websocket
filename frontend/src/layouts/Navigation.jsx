import { Home } from "@mui/icons-material";
import { Box, List, ListItem, ListItemButton, ListDivider } from "@mui/joy";
import React, { Fragment } from "react";
import { Outlet, Link } from "react-router-dom";
/**
 * @type {React.CSSProperties}
 */
const style = {
  textDecoration: "none",
  color: "inherit",
  fontWeight: 500,
};
const Navigation = () => {
  return (
    <Fragment>
      <Box component="nav" aria-label="My site" sx={{ flexGrow: 1 }} bgcolor={"#e0e0e0"}>
        <List role="menubar" row>
          <ListItem role="none">
            <ListItemButton role="menuitem" component="div" aria-label="Home">
              <Home />
            </ListItemButton>
          </ListItem>
          <ListDivider />
          <ListItem>
            <Link to="lists" style={style}>
              <ListItemButton role="menuitem">Listas</ListItemButton>
            </Link>
          </ListItem>
          <ListDivider />
          <ListItem>
            <Link to="messages" style={style}>
              <ListItemButton role="menuitem">Mensajes</ListItemButton>
            </Link>
          </ListItem>
          <ListItem>
            <Link to="trueorfalse" style={style}>
              <ListItemButton role="menuitem">True or False</ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
