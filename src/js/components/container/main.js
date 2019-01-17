import React, { Component } from 'react';
import TheNav from '../presentational/thenav';
import Tree from '../presentational/tree';
import Dialog from '../presentational/dialog';
import MoveForm from '../presentational/move-form';
import ArrangeForm from '../presentational/arrange-form';
import {
  elements,
  getSlide,
  getElement,
  getElementInfo,
  tranlateDataToUI,
  translateUIToData,
} from '../../helpers/helpers';
import {
  CreateSlide,
  RefreshSlides,
  GetInfo,
  MoveObject,
  AIMoveObjects,
  ResetObjectsSizes,
} from '../../helpers/slides';
import { Population } from 'evo';

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
      resetModal: false,
      slideElements: {},
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
    this.handleResetDialog = this.handleResetDialog.bind(this);
    this.handleResetDialogCancel = this.handleResetDialogCancel.bind(this);
    this.handleResetDialogReset = this.handleResetDialogReset.bind(this);
    this.handleSlideElements = this.handleSlideElements.bind(this);
  }

  handleSlideElements({ slideId, presentation }) {
    if (!slideId) null;
    const s = presentation.slides.filter(s => {
      return s.objectId === slideId;
    })[0];

    const slideElements = elements(s.pageElements, presentation);

    this.setState({ slideElements });
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

    this.handleSlideElements({
      slideId: ev.target.value,
      presentation: this.state.presentation,
    });
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

  handleResetDialog() {
    this.setState({ resetModal: !this.state.resetModal });
  }

  handleResetDialogCancel() {
    this.setState({ slideId: null, resetModal: false });
  }

  handleResetDialogReset() {
    ResetObjectsSizes(
      this.state.presentation,
      this.state.slideId,
      this.state.slideElements,
      () => {
        this.setState({
          slideId: null,
          elementId: null,
          slideElements: null,
        });
        RefreshSlides(this.handleRefreshPresentaton.bind(this));
        this.setState({ resetModal: false });
      }
    );
  }

  handleArrangeDialogArrange() {
    const population = new Population({
      maxIterationsBestScore: 500,
      iterations: 1000,
      mutationChance: 0.7,
      mateChance: 0.7,
      size: 100,
    });

    Promise.resolve()
      .then(() => population.run(this.state.slideElements))
      .then(bestGene => {
        console.log('bestGene: ', bestGene);
        this.setState({
          arrangeModal: false,
          slideElements: bestGene.elements,
        });
      })
      .then(() => {
        console.log('AIMoveObjects');
        AIMoveObjects(
          this.state.presentation,
          this.state.slideId,
          this.state.slideElements,
          () => {
            this.setState({
              slideId: null,
              elementId: null,
              slideElements: null,
            });
            RefreshSlides(this.handleRefreshPresentaton.bind(this));
          }
        );
      });
  }

  handleDialogMove() {
    translateUIToData(this.state.element, this.state.presentation);
    MoveObject(
      this.state.presentation.presentationId,
      this.state.elementId,
      this.state.element.data,
      () => {
        this.setState({ slideId: null, elementId: null, modal: false });
        RefreshSlides(this.handleRefreshPresentaton.bind(this));
      }
    );
  }

  handleGetInfo() {
    GetInfo(this.state.presentation);
  }

  handleSignIn() {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(res => console.log('signin', res))
      .then(() => this.setState({ authorized: true }))
      .catch(err => console.log(err));
  }

  handleSignOut() {
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

  handleRefreshSlide() {
    RefreshSlides(this.handleRefreshPresentaton.bind(this));
  }

  handleCreateSlide() {
    CreateSlide(() => {
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
          handleResetDialog={this.handleResetDialog}
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
            slideElements={this.state.slideElements}
            showTree="true"
          />
        </Dialog>

        <Dialog
          buttonLabel={'Reset Size'}
          title={'Reset Element Sizes'}
          handleCancel={this.handleResetDialogCancel}
          handleMove={this.handleResetDialogReset}
          modal={this.state.resetModal}
        >
          <ArrangeForm
            pickSlide={this.handlePickSlide}
            presentation={this.state.presentation}
            slideId={this.state.slideId}
            slideElements={this.state.slideElements}
            showTree="false"
          />
        </Dialog>
      </>
    );
  }
}

export default Main;
