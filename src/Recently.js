import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Divider } from "@material-ui/core";

const styles = theme => ({
  paper: {
    padding: theme.spacing(2)
  },
  typography: {
    padding: theme.spacing(1, 0)
  },
  divider: {
    margin: theme.spacing(2, 0)
  }
});

function Recently(props) {
  const { classes } = props;

  const data = props.recent;
  console.log(data);
  return (
    <div>
      <Typography variant="h5" className={classes.typography}>
        인기 검색어
      </Typography>
      <Divider className={classes.divider} />
      <Grid container spacing={3}>
        {data.map((item, i) => {
          return (
            <RecentItem
              classes={classes}
              name={item.keyword}
              count={item.count}
              reLoad={props.reLoad}
              key={i}
            />
          );
        })}
      </Grid>
    </div>
  );
}

function RecentItem(props) {
  return (
    <Grid item xs={6}>
      <Paper
        className={props.classes.paper}
        onClick={() => props.reLoad(props.name)}
        style={{ cursor: "pointer" }}
      >
        <Grid container>
          <Grid item xs={6}>
          <Typography variant="body1" align="left">{props.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" align="right">{props.count}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default withStyles(styles)(Recently);
