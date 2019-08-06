import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, Link, IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { signIn, signOut } from '../../actions';

// Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import LoginIcon from '@material-ui/icons/LocalGasStation';
import CameraIcon from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  avatar: {
    marginRight: theme.spacing(1),
    borderRadius: '50%'
  }
}));

const Header = ({ auth, signIn, signOut }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(undefined);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar className={classes.toolbar}>
        <CameraIcon className={classes.icon} />
        <Typography variant="h6" color="inherit" className={classes.toolbarTitle}>
          Futsal Championship
        </Typography>
        <div>
          <Link variant="button" color="textPrimary" href="/" className={classes.link}>
            Home
          </Link>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
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
                  <img src={auth.photoURL} alt=".,." className={classes.avatar} width="40" />
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

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(Header);
