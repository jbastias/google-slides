import React, { Component } from 'react';
import TheNav from '../presentational/thenav';
import Tree from '../presentational/tree';
import Dialog from '../presentational/dialog';
import MoveForm from '../presentational/move-form';
import ArrangeForm from '../presentational/arrange-form';
import { getSlide, getElement, getElementInfo } from '../../helpers/helpers';
import {
  CreateSlide,
  RefreshSlides,
  GetInfo,
  MoveObject,
} from '../../helpers/slides';

const getUnitsTable = presentation => {
  const width = presentation.pageSize.width.magnitude;
  const height = presentation.pageSize.height.magnitude;
  return {
    CM: 1 / 360000,
    IN: 1 / 914400,
    PT: 1 / 12700,
    PX: 1 / 9525,
    FRACTION: { x: 1 / width, y: 1 / height },
    EMU: 1,
  };
};

const toDataUnit = (unitsTbl, unit, value, direction) => {
  if (unit === 'FRACTION') {
    return value / unitsTbl[`${unit}`][`${direction}`];
  } else {
    return value / unitsTbl[unit];
  }
};

const toUIUnit = (unitsTbl, unit, value, direction) => {
  if (unit === 'FRACTION') {
    return value * unitsTbl[`${unit}`][`${direction}`];
  } else {
    return value * unitsTbl[unit];
  }
};

const translateUIToData = (element, presention) => {
  if (element.unit === 'EMU') {
    element.data = element.UI;
  } else {
    element.data.translateX = toDataUnit(
      getUnitsTable(presention),
      element.unit,
      element.UI.translateX,
      'x'
    );
    element.data.translateY = toDataUnit(
      getUnitsTable(presention),
      element.unit,
      element.UI.translateY,
      'y'
    );
    element.data.scaleX = element.UI.scaleX;
    element.data.scaleY = element.UI.scaleY;
  }
};

const tranlateDataToUI = (ev, element, presention) => {
  if (ev.target.name === 'unit') {
    element[ev.target.name] = ev.target.value;
    element.UI.translateX = toUIUnit(
      getUnitsTable(presention),
      element.unit,
      element.data.translateX,
      'x'
    );
    element.UI.translateY = toUIUnit(
      getUnitsTable(presention),
      element.unit,
      element.data.translateY,
      'y'
    );
  } else {
    element.UI[ev.target.name] = Number(ev.target.value);
  }
  return Object.assign({}, element);
};

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
      arrangeModal: false,
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleRefreshSlide = this.handleRefreshSlide.bind(this);
    this.handleCreateSlide = this.handleCreateSlide.bind(this);
    this.handleGetInfo = this.handleGetInfo.bind(this);
    this.handleMoveElement = this.handleMoveElement.bind(this);
    this.handleDialog = this.handleDialog.bind(this);
    this.handleDialogCancel = this.handleDialogCancel.bind(this);
    this.handleDialogMove = this.handleDialogMove.bind(this);
    this.handlePickSlide = this.handlePickSlide.bind(this);
    this.handlePickElement = this.handlePickElement.bind(this);
    this.handleArrangeDialog = this.handleArrangeDialog.bind(this);
    this.handleArrangeDialogCancel = this.handleArrangeDialogCancel.bind(this);
    this.handleArrangeDialogArrange = this.handleArrangeDialogArrange.bind(
      this
    );
  }

  handleMoveElement(ev) {
    this.setState({
      element: tranlateDataToUI(
        ev,
        this.state.element,
        this.state.presentation
      ),
    });
  }

  handlePickSlide(ev) {
    !ev.target.value
      ? this.setState({ slideId: null, elementId: null })
      : this.setState({ slideId: ev.target.value, elementId: null });
  }

  handlePickElement(ev) {
    !ev.target.value
      ? this.setState({ elementId: null })
      : this.setState({ elementId: ev.target.value });
    this.handleElementState(ev.target.value);
  }

  handleElementState(el) {
    const slide = getSlide(this.state.presentation, this.state.slideId);
    const element = getElement(slide, el);
    const elementInfo = getElementInfo(element);
    this.setState({ element: elementInfo });
  }

  handleDialog() {
    this.setState({ modal: !this.state.modal });
  }

  handleDialogCancel() {
    this.setState({ slideId: null, elementId: null, modal: false });
  }

  handleArrangeDialog() {
    this.setState({ arrangeModal: !this.state.arrangeModal });
  }

  handleArrangeDialogCancel() {
    this.setState({ slideId: null, arrangeModal: false });
  }

  handleArrangeDialogArrange() {
    console.log('=== arrange elements ===');
    this.setState({ slideId: null, arrangeModal: false });
  }

  handleDialogMove() {
    translateUIToData(this.state.element, this.state.presentation);
    MoveObject(
      this.state.presentation.presentationId,
      this.state.elementId,
      this.state.element.data,
      res => {
        // console.log(result);
        this.setState({ slideId: null, elementId: null, modal: false });
        RefreshSlides(this.handleRefreshPresentaton.bind(this));
      }
    );
  }

  handleGetInfo() {
    GetInfo(this.state.presentation);
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
          handleGetInfo={this.handleGetInfo}
          handleDialog={this.handleDialog}
          handleArrangeDialog={this.handleArrangeDialog}
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
            elementInfo={this.state.element}
            handleMove={this.handleMoveElement}
          />
        </Dialog>
        <Dialog
          buttonLabel={'Arrange'}
          title={'Arrange Elements'}
          handleCancel={this.handleArrangeDialogCancel}
          handleMove={this.handleArrangeDialogArrange}
          modal={this.state.arrangeModal}
        >
          <ArrangeForm
            pickSlide={this.handlePickSlide}
            presentation={this.state.presentation}
            slideId={this.state.slideId}
          />
        </Dialog>
      </>
    );
  }
}

export default Main;
