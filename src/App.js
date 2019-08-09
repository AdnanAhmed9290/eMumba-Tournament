import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { PointsTable, SignIn, Match, Team, AddMatch, MatchList, Stats } from './views';
import { fetchUser, fetchTeams, fetchMatches, getTopScorer } from './actions';
import { Snackbar, requireAdmin, Layout } from './components';

import './App.scss';

class App extends Component {
  componentDidMount() {
    this.initializeApp();
  }

  initializeApp = () => {
    this.props.fetchUser();
    this.props.fetchTeams();
    this.props.fetchMatches();
    this.props.getTopScorer();
  };

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <>
              <Route exact strict path="/" render={() => <Redirect to="/table" />} />
              <Route path="/table" component={PointsTable} />
              <Route path="/login" component={SignIn} />
              <Route exact path="/matches" component={MatchList} />
              <Route path="/matches/:id" component={Match} />
              <Route path="/addPlayer" component={requireAdmin(Team)} />
              <Route path="/addMatch" component={AddMatch} />
              <Route path="/stats" component={Stats} />
            </>
          </Switch>
          <Snackbar />
        </Layout>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  { fetchUser, fetchTeams, fetchMatches, getTopScorer }
)(App);
