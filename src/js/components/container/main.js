import React, { Component } from 'react';
import TheNav from '../presentational/thenav';
import Tree from '../presentational/tree';
import Dialog from '../presentational/dialog';
import MoveForm, {
  getSlide,
  getElement,
  getElementInfo,
} from '../presentational/move-form';

import {
  CreateSlide,
  RefreshSlides,
  GetShapes,
  MoveStuff,
  MoveObject,
} from '../../helpers/slides';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      authorized: false,
      modal: false,
      presentation: {},
      slideId: null,
      elementId: null,
      element: {},
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleRefreshSlide = this.handleRefreshSlide.bind(this);
    this.handleCreateSlide = this.handleCreateSlide.bind(this);
    this.handleGetShapes = this.handleGetShapes.bind(this);
    this.handleMoveShape = this.handleMoveShape.bind(this);
    this.handlMoveObject = this.handlMoveObject.bind(this);

    this.handleDialog = this.handleDialog.bind(this);
    this.handleDialogCancel = this.handleDialogCancel.bind(this);
    this.handleDialogMove = this.handleDialogMove.bind(this);
    this.handleUpdateElement = this.handleUpdateElement.bind(this);

    this.handlePickElement = this.handlePickElement.bind(this);

    this.handlePickSlide = this.handlePickSlide.bind(this);
    this.handlePickElement = this.handlePickElement.bind(this);
  }

  handlMoveObject(ev) {
    // console.log('hello', ev.target.value, ev.target.name);
    // console.log('BEFORE state: ', JSON.stringify(this.state.element, null, 2));
    const element = this.state.element;
    element[ev.target.name] = Number(ev.target.value);
    this.setState({ element });
    // console.log('AFTER state: ', JSON.stringify(this.state.element, null, 2));
  }

  handlePickSlide(ev) {
    // console.log('slideId', ev.target.value);
    !ev.target.value
      ? this.setState({ slideId: null, elementId: null })
      : this.setState({ slideId: ev.target.value, elementId: null });
  }

  handlePickElement(ev) {
    // console.log('elementId', ev.target.value);

    !ev.target.value
      ? this.setState({ elementId: null })
      : this.setState({ elementId: ev.target.value });

    // console.log('elementId', this.state.elementId);

    this.handleElementState(ev.target.value);
  }

  handleElementState(el) {
    // console.log('handleElementState');
    // console.log('elementId', this.state.elementId);

    // if (!this.state.elementId) return;

    const slide = getSlide(this.state.presentation, this.state.slideId);
    // console.log('slide: ', slide);
    // console.log('this.state.elementId: ', this.state.elementId);
    const element = getElement(slide, el);
    // console.log('element: ', element);
    const elementInfo = getElementInfo(element);

    // console.log(elementInfo);

    this.setState({ element: elementInfo });
  }

  handleDialog() {
    // alert('booo');
    this.setState({ modal: !this.state.modal });
  }

  handleDialogCancel() {
    // alert('booo');
    this.setState({ slideId: null, elementId: null, modal: false });
    // this.setState({ modal: !this.state.modal });
  }

  handleDialogMove() {
    // alert('booo');
    MoveObject(
      this.state.presentation.presentationId,
      this.state.elementId,
      this.state.element,
      res => {
        // console.log(JSON.stringify(res, null, 2));

        this.setState({ slideId: null, elementId: null, modal: false });
        // this.setState({ modal: false });
        RefreshSlides(this.handleRefreshPresentaton.bind(this));
      }
    );
  }

  handleUpdateElement(elementInfo) {
    console.log(JSON.stringify(elementInfo, null, 2));
    // this.setState({ element: elementInfo });
  }

  handleGetShapes() {
    GetShapes(this.state.presentation);
  }

  handleMoveShape() {
    MoveStuff(this.state.presentation, result => {
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
    localStorage.setItem('presentation', JSON.stringify(presentation));
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
    const presentation = localStorage.setItem(
      'presentation',
      JSON.stringify(presentation)
    );
    if (connected === 'true') {
      // this.setState({ presentation: JSON.parse(presentation) });
      this.setState({ authorized: true });
    } else {
      // this.setState({ presentation: JSON.parse(presentation) });

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
          handleDialog={this.handleDialog}
        />
        <Tree data={this.state.presentation} />
        <Dialog
          title={'Move/Scale Element'}
          handleCancel={this.handleDialogCancel}
          handleMove={this.handleDialogMove}
          modal={this.state.modal}
        >
          <MoveForm
            pickSlide={this.handlePickSlide}
            pickElement={this.handlePickElement}
            presentation={this.state.presentation}
            slideId={this.state.slideId}
            elementId={this.state.elementId}
            handleUpdateElement={this.handleUpdateElement}
            elementInfo={this.state.element}
            handleMove={this.handlMoveObject}
          />
        </Dialog>
      </>
    );
  }
}

export default Main;
