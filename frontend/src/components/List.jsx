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
  Typography,
  Stack,
  Badge,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
const avatarInitials = (name) => {
  const noName = name ?? "Unknow Name";
  var initials = noName.match(/\b\w/g) || [];
  initials = ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  return initials;
};
const ListComponent = ({
  data,
  primary,
  secondary,
  primaryLevel,
  title,
  onDelete = () => {},
  loading,
}) => {
  return (
    <Fragment>
      <Paper elevation={4}>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: 250,
            height: 250,
            paddingBottom: 0,
          }}
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              sx={{
                bgcolor: (x) => x.palette.grey["A100"],
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Stack direction="row" p={1} justifyContent="space-between">
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  <Badge badgeContent={`${data?.length}`} color="info" max={999} />
                </Typography>
              </Stack>
            </ListSubheader>
          }
        >
          {loading && (
            <ListItem
              sx={{
                height: "calc(100% - 42px)",
                justifyContent: "center",
                // bgcolor: "rgba(0,0,0,.35)",
              }}
            >
              <CircularProgress color="success" />
            </ListItem>
          )}

          {data.map((item, index) => {
            return (
              <Fragment key={item?.id ?? index}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDelete(item.id)}
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {avatarInitials(
                        primaryLevel && primary ? item?.[primary]?.[primaryLevel] : item?.[primary]
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      primaryLevel && primary && item?.[primary]?.[primaryLevel]
                        ? item?.[primary]?.[primaryLevel]
                        : primary && item?.[primary]
                        ? item?.[primary]
                        : "Unknown"
                    }
                    secondary={item?.[secondary]}
                    primaryTypographyProps={{
                      style: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
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
                <Divider />
              </Fragment>
            );
          })}
        </List>
      </Paper>
    </Fragment>
  );
};

export default ListComponent;
