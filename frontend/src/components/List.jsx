import React, { Fragment } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  ListSubheader,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
const avatarInitials = (name) => {
  var initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  return initials;
};
const ListComponent = ({ data, primary, secondary, primaryLevel, title }) => {
  return (
    <Fragment>
      <Paper elevation={4}>
        <List
          sx={{
            width: "100%",
            // maxWidth: 360,
            bgcolor: "background.paper",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: 250,
          }}
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              sx={{ bgcolor: (x) => x.palette.grey["A100"] }}
            >
              {title}
            </ListSubheader>
          }
        >
          <Divider />

          {data.map((item, index) => {
            return (
              <ListItem
                key={item?.id ?? index}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e) => console.log(e)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    {avatarInitials(primaryLevel ? item?.[primary][primaryLevel] : item?.[primary])}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={primaryLevel ? item?.[primary][primaryLevel] : item?.[primary]}
                  secondary={item?.[secondary]}
                  primaryTypographyProps={{
                    style: {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                  secondaryTypographyProps={{
                    style: {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Fragment>
  );
};

export default ListComponent;
