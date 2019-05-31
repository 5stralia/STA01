import React from "react";
import PropTypes from "prop-types";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Content from "./Content";
import Header from "./Header";
import { Container } from "@material-ui/core";
import Searched from "./Searched";
import Axios from "axios";

let theme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3"
    }
  },
  shape: {
    borderRadius: 8
  }
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: "#18202c"
      }
    },
    MuiButton: {
      label: {
        textTransform: "none"
      },
      contained: {
        boxShadow: "none",
        "&:active": {
          boxShadow: "none"
        }
      }
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1)
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white
      }
    },
    MuiTab: {
      root: {
        textTransform: "none",
        margin: "0 16px",
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up("md")]: {
          padding: 0,
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1)
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: "#404854"
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    }
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48
    }
  }
};

const drawerWidth = 256;

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  mainContent: {
    flex: 1,
    padding: "48px 36px 0",
    background: "#eaeff1"
  },
  introContent: {
    padding: theme.spacing(3, 2)
  },
  introBox: {
    padding: theme.spacing(0, 0, 5, 0)
  }
};

class App extends React.Component {
  state = {
    mobileOpen: false,
    get: "None",
    query: "",
    isSearch: 0,
    recent: []
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  componentDidMount = () => {
    Axios.get("http://127.0.0.1:5000/popular")
      .then(response => {
        console.log(response);
        this.setState({ recent: response.data.keywords });
      })
      .catch(response => alert(response));
  };

  reLoad = query => {
    if (query == "") return;
    this.setState({ isSearch: 1 });
    this.setState({ query: query });
  };

  render() {
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <div className={classes.appContent}>
            <Header onDrawerToggle={this.handleDrawerToggle} />
            {this.state.isSearch == 0 ? (
              <main className={classes.mainContent}>
                <Container maxWidth="sm" className={classes.introBox}>
                  <Paper className={classes.introContent}>
                    <Typography variant="h5" component="h5" align="center">
                      전 세계 사용자들의 관심 동향을 살펴보세요
                    </Typography>
                  </Paper>
                </Container>
                <Content reLoad={this.reLoad} recent={this.state.recent} />
              </main>
            ) : (
              <Searched query={this.state.query} />
            )}
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
