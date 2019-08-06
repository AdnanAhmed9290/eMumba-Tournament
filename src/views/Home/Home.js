import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from '@material-ui/core';
import PropTypes from 'prop-types';

import { TabPanel, PointsTable, MatchList } from '../../components';

class Home extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    currentTab: 'table'
  };

  handleTabChange = (event, newValue) => {
    this.setState({
      currentTab: newValue
    });
  };

  handleOnMatchClick = id => {
    this.context.router.history.push(`/match/${id}`);
  };

  render() {
    const { currentTab } = this.state;
    const { matches } = this.props;

    return (
      <div
        style={{
          flexGrow: 1,
          width: '100%'
        }}>
        <Tabs
          value={currentTab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered>
          <Tab label="Table" value="table" />
          <Tab label="Matches" value="matches" />
          <Tab label="Teams" value="teams" />
        </Tabs>
        <TabPanel value={currentTab} index="table">
          <PointsTable />
        </TabPanel>
        <TabPanel value={currentTab} index="matches">
          <MatchList matches={matches} handleOnMatchClick={this.handleOnMatchClick} />
        </TabPanel>
        <TabPanel value={currentTab} index="teams">
          Item Three
        </TabPanel>
      </div>
    );
  }
}

const mapStateToProps = ({ teams, matches }) => ({
  teams,
  matches
});

export default connect(
  mapStateToProps,
  null
)(Home);
