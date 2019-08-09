import React from 'react';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Drawer, ListItem, ListItemText, ListItemIcon, List } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

// icons
import UsersIcon from '@material-ui/icons/People';

import * as football from '../../assets/football.png';
import * as pointsTable from '../../assets/points-table.png';
import * as matches from '../../assets/matches.png';
import * as stats from '../../assets/stats.png';

// src
import './SideNav.scss';
import { ROUTES } from '../../constants';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  toolbarIcon: {
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    paddingTop: 60,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  navlink: {
    color: 'unset'
  },
  navlinkActive: {
    '& > div': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
  },
  appLogo: {
    display: 'flex',
    alignItems: 'center'
  },
  linkItem: {
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 10
    }
  }
}));

const navigationIcon = (iconType = '') => {
  switch (iconType) {
    case 'match':
      return <img src={football} alt=".." width="30" />;
    case 'table':
      return <img src={pointsTable} alt=".." width="30" />;
    case 'matches':
      return <img src={matches} alt=".." width="30" />;
    case 'stats':
      return <img src={stats} alt=".." width="30" />;
    default:
      return <UsersIcon className="icon" />;
  }
};

const SideNav = props => {
  const classes = useStyles({});
  const { showSideNav, isAdmin = false } = props;

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classnames(classes.drawerPaper, !showSideNav && classes.drawerPaperClose)
      }}
      open={showSideNav}
      className="sideNav">
      {/* SideNav Navigation */}
      <List className="side-nav__nav-list">
        {Object.values(ROUTES).map(route => {
          if (route.requireAdmin) {
            return isAdmin ? (
              <NavLink
                className={classes.navlink}
                activeClassName={classes.navlinkActive}
                to={route.path}
                key={route.title}>
                <ListItem button className={classes.linkItem}>
                  <ListItemIcon>{navigationIcon(route.icon)}</ListItemIcon>
                  <ListItemText primary={route.title} />
                </ListItem>
              </NavLink>
            ) : null;
          } else {
            return (
              <NavLink
                className={classes.navlink}
                activeClassName={classes.navlinkActive}
                to={route.path}
                key={route.title}>
                <ListItem button className={classes.linkItem}>
                  <ListItemIcon>{navigationIcon(route.icon)}</ListItemIcon>
                  <ListItemText primary={route.title} />
                </ListItem>
              </NavLink>
            );
          }
        })}
      </List>
    </Drawer>
  );
};

export default SideNav;
