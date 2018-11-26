import React, { Component } from 'react';
import TheNav from '../presentational/thenav';
import Tree from '../presentational/tree';
import {
  CreateSlide,
  RefreshSlides,
  GetShapes,
  GetMoveStuff,
} from '../../helpers/slides';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      authorized: false,
      presentation: {},
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleRefreshSlide = this.handleRefreshSlide.bind(this);
    this.handleCreateSlide = this.handleCreateSlide.bind(this);
    this.handleGetShapes = this.handleGetShapes.bind(this);
    this.handleMoveShape = this.handleMoveShape.bind(this);
  }

  handleGetShapes() {
    GetShapes(this.state.presentation);
  }

  handleMoveShape() {
    GetMoveStuff(this.state.presentation, result => {
      // console.log(result);
      RefreshSlides(this.handleRefreshPresentaton.bind(this));
    });
  }

  handleSignIn(ev) {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(res => console.log('signin', res))
      .then(() => this.setState({ authorized: true }))
      .catch(err => console.log(err));
  }

  handleSignOut(ev) {
    gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(res => console.log('signout: ', res))
      .then(() => this.setState({ authorized: false }))
      .catch(err => console.log(err));
  }

  handleRefreshPresentaton(presentation) {
    this.setState({ presentation });
  }

  handleRefreshSlide(ev) {
    RefreshSlides(this.handleRefreshPresentaton.bind(this));
  }

  handleCreateSlide(ev) {
    CreateSlide(result => {
      // console.log(result);
      RefreshSlides(this.handleRefreshPresentaton.bind(this));
    });
  }

  componentDidMount() {
    const connected = localStorage.getItem('connected');
    if (connected === 'true') {
      this.setState({ authorized: true });
    } else {
      this.setState({ authorized: true });
    }
  }

  render() {
    return (
      <>
        <TheNav
          handleSignIn={this.handleSignIn}
          authorized={this.state.authorized}
          handleCreateSlide={this.handleCreateSlide}
          handleSignOut={this.handleSignOut}
          handleRefreshSlide={this.handleRefreshSlide}
          handleGetShapes={this.handleGetShapes}
          handleMoveShape={this.handleMoveShape}
        />
        <Tree data={this.state.presentation} />
      </>
    );
  }
}

export default Main;
