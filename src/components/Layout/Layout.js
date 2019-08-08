import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { connect } from 'react-redux';

import './Layout.scss';
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';

class Layout extends Component {
  state = {
    showSideNav: false
  };

  toggleSideNav = (bool: boolean) => {
    this.setState({
      showSideNav: bool
    });
  };

  render() {
    const { showSideNav } = this.state;

    return (
      <div className="page-wrapper">
        <CssBaseline />
        <Header showSideNav={showSideNav} handleDrawerOpen={this.toggleSideNav} />
        <SideNav
          showSideNav={showSideNav}
          handleDrawerClose={this.toggleSideNav}
          isAdmin={this.props.isAdmin}
        />
        <main className="page-wrapper__content-wrap">{this.props.children}</main>
      </div>
    );
  }
}

const mapStateToProps = ({ isAdmin }) => ({ isAdmin });

export default withRouter(connect(mapStateToProps)(Layout));
