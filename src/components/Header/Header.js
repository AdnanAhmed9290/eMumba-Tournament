import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, Link, IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { signIn, signOut } from '../../actions';

// Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import LoginIcon from '@material-ui/icons/LockOpen';
import MenuIcon from '@material-ui/icons/Menu';

import * as logo from '../../assets/logo-1.png';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1,
    marginLeft: 10
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  avatar: {
    marginRight: '15px',
    borderRadius: '50%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));

const Header = ({ auth, signIn, signOut, isAdmin, showSideNav, handleDrawerOpen }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(undefined);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <AppBar
      position="absolute"
      color="default"
      elevation={0}
      className={classnames(
        'header',
        { open: showSideNav },
        classes.appBar,
        showSideNav && classes.appBarShift
      )}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Open drawer"
          onClick={() => handleDrawerOpen(true)}
          className={classnames({
            'menu-button': true,
            hidden: showSideNav
          })}>
          <MenuIcon />
        </IconButton>
        <img src={logo} className="logo" alt="logo" width="50" />
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          className={classnames('app-title', classes.toolbarTitle)}>
          eMumba Champions Cup
        </Typography>
        <div>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            className="account-btn"
            color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            {auth === null ? (
              <MenuItem onClick={signIn}>
                <LoginIcon className={classes.icon} />
                Login
              </MenuItem>
            ) : (
              <>
                <MenuItem>
                  <img src={auth.photoURL} alt=".." className={classes.avatar} width="30" />
                  <Typography variant="subheading">{auth.displayName || auth.email}</Typography>
                </MenuItem>

                <MenuItem onClick={signOut}>
                  <LogoutIcon className={classes.icon} />
                  Logout
                </MenuItem>
              </>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = ({ auth, isAdmin }) => ({ auth, isAdmin });

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(Header);
