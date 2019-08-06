import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Home, SignIn, Match, Team, Matches } from './views';
import { fetchUser, fetchTeams, fetchMatches } from './actions';
import { Header } from './components';
import { CssBaseline } from '@material-ui/core';

class App extends Component {
  componentDidMount() {
    this.initializeApp();
  }

  initializeApp = () => {
    this.props.fetchUser();
    this.props.fetchTeams();
    this.props.fetchMatches();
  };

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <>
            <CssBaseline />
            <Header />
            <main className="container">
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={SignIn} />
              <Route exact path="/match/:id" component={Match} />
              <Route exact path="/addPlayer" component={Team} />
              <Route exact path="/addMatch" component={Matches} />
              {/* <Route path="/app" component={Authorize(ToDoList)} /> */}
            </main>
          </>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  { fetchUser, fetchTeams, fetchMatches }
)(App);
