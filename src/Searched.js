import React from "react";
import { withStyles, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const style = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2, 2, 0.5, 2),
    margin: theme.spacing(2, 2)
  },
  img: {
    width: "100%"
  },
  divider: {
    margin: theme.spacing(0, 0, 2, 0)
  },
  itemDiv: {
    margin: theme.spacing(0.5, 0, 1, 1),
    backgroundColor: "#C0C0C0"
  },
  item: {
    margin: theme.spacing(0, 2)
  }
});

const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
  return (
    <text
      x={x + width / 2}
      y={y}
      fill="#666"
      textAnchor="middle"
      dy={-6}
    >{`${value}`}</text>
  );
};

function sumOf(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    result = result + arr[i].count;
  }
  return result;
}

class Searched extends React.Component {
  state = {
    query: this.props.query,
    keywords: [],
    pos: [],
    neg: [],
    sumK: 0,
    sumP: 0,
    sumN: 0
  };

  componentDidMount = () => {
    axios
      .get("http://127.0.0.1:5000/search/" + this.state.query)
      .then(response => {
        console.log(response.data);
        if (response.data.get == "success") {
          this.setState({ keywords: response.data.keywords.items });
          this.setState({ pos: response.data.pos.items });
          this.setState({ neg: response.data.neg.items });
          this.setState({ sumK: sumOf(response.data.keywords.items) });
          this.setState({ sumP: sumOf(response.data.pos.items) });
          this.setState({ sumN: sumOf(response.data.neg.items) });
        } else {
          alert("분석을 시작했습니다\n잠시 뒤에 다시 검색하세요");
          // TODO : 첫 화면으로 돌아가기
        }
      })
      .catch(response => alert(response));
  };

  f2s = (value, sum) => {
    value = value / sum;
    return value * 100 + "%";
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                {this.props.query}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          <Paper className={classes.paper}>
            <img
              className={classes.img}
              src={"http://127.0.0.1:5000/searchimg/filename.png"}
              alt="Wordcloud"
            />
          </Paper>
        </div>
        <div>
          <Paper className={classes.paper}>
            <Typography variant="h5">단어별 빈도수</Typography>
            <Divider className={classes.divider} />
            <BarChart
              width={800}
              height={200}
              data={this.state.keywords.map((item, i) => {
                return {
                  name: item.name,
                  빈도: item.count / this.state.sumK
                };
              })}
            >
              <XAxis dataKey="name" />
              {/* <YAxis /> */}
              <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
              {/* <CartesianGrid stroke="#eee" strokeDasharray="5 5"/> */}
              <Bar
                type="monotone"
                dataKey="빈도"
                fill="#009BE4"
                label={renderCustomBarLabel}
                labelfommater={(value, name, props) => {
                  return ["formatted value", "formatted name"];
                }}
              />
            </BarChart>
          </Paper>
        </div>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5">Keywords</Typography>
                <Divider className={classes.divider} />
                <Grid container spacing={1}>
                  {this.state.keywords.map((item, i) => {
                    return (
                      <Grid item xs={6}>
                        <Grid container>
                          <Grid item xs={6}>
                            <Typography
                              className={classes.item}
                              variant="body1"
                              align="left"
                            >
                              {item.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              className={classes.item}
                              variant="body1"
                              align="right"
                            >
                              {item.count > 0
                                ? this.f2s(item.count, this.state.sumK)
                                : "0%"}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Divider className={classes.itemDiv} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h5">POS</Typography>
                <Divider className={classes.divider} />
                {this.state.pos.map((item, i) => {
                  return (
                    <Grid item xs={12}>
                      <Typography
                        className={classes.item}
                        variant="body1"
                        align="left"
                      >
                        {item}
                      </Typography>
                      <Divider className={classes.itemDiv} />
                    </Grid>
                  );
                })}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h5">NEG</Typography>
                <Divider className={classes.divider} />
                {this.state.neg.map((item, i) => {
                  return (
                    <Grid item xs={12}>
                      <Typography
                        className={classes.item}
                        variant="body1"
                        align="left"
                      >
                        {item}
                      </Typography>
                      <Divider className={classes.itemDiv} />
                    </Grid>
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(Searched);
