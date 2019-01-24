import React, { Component } from 'react';
import { Population } from 'evo';
import { TheNav, Tree, Dialog, MoveForm, ArrangeForm } from '../';
import {
  getSlide,
  getElement,
  getElementInfo,
  tranlateDataToUI,
  translateUIToData,
  RefreshSlides,
  MoveObject,
  AIMoveObjects,
  ResetObjectsSizes,
  CreateSlide,
  GetPresentationInfo,
  makeElements,
  makePresObj,
} from '../../helpers';

class Main extends Component {
  constructor() {
    super();

    this.state = {
      presId: '1wtG0Wvt_p7Qrziu-D1LODmB1irORHiHo4UxGR3q2Dfg',
      authorized: false,
      modal: false,
      presentation: {},
      slideId: null,
      elementId: null,
      element: {},
      arrangeModal: false,
      resetModal: false,
      slideElements: {},
      presObj: null,
    };

    // nav buttons
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleRefreshSlide = this.handleRefreshSlide.bind(this);
    this.handleCreateSlide = this.handleCreateSlide.bind(this);
    this.handleGetPresentationInfo = this.handleGetPresentationInfo.bind(this);

    // move dialog
    this.handleMoveElementProperty = this.handleMoveElementProperty.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogCancel = this.handleDialogCancel.bind(this);
    this.handleDialogMove = this.handleDialogMove.bind(this);

    // arrange dialog
    this.handleArrangeDialogOpen = this.handleArrangeDialogOpen.bind(this);
    this.handleArrangeDialogCancel = this.handleArrangeDialogCancel.bind(this);
    this.handleArrangeDialogDo = this.handleArrangeDialogDo.bind(this);

    // reset dialog
    this.handleResetDialogOpen = this.handleResetDialogOpen.bind(this);
    this.handleResetDialogCancel = this.handleResetDialogCancel.bind(this);
    this.handleResetDialogDo = this.handleResetDialogDo.bind(this);

    // utils
    this.handlePickSlide = this.handlePickSlide.bind(this);
    this.handlePickElement = this.handlePickElement.bind(this);
    this.handleSlideElements = this.handleSlideElements.bind(this);
  }

  // nav buttons
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

  handleRefreshSlide() {
    RefreshSlides(this.state.presId, this.handleRefreshPresentaton.bind(this));
    console.log('slides have been refreshed');
  }

  handleRefreshPresentaton(presentation) {
    localStorage.setItem('presentation', JSON.stringify(presentation));
    this.setState({ presentation, presObj: makePresObj(presentation) });
  }

  handleCreateSlide() {
    CreateSlide(this.state.presId, () => {
      RefreshSlides(
        this.state.presId,
        this.handleRefreshPresentaton.bind(this)
      );
    });
  }

  handleGetPresentationInfo() {
    GetPresentationInfo(this.state.presentation);
  }

  handleSlideElements({ slideId, presentation }) {
    if (!slideId) null;
    const s = getSlide(presentation, slideId);
    const slideElements = makeElements(s.pageElements, presentation, slideId);
    this.setState({ slideElements });
  }

  // move dialog
  handleMoveElementProperty(ev) {
    this.setState({
      element: tranlateDataToUI(
        ev,
        this.state.element,
        this.state.presentation
      ),
    });
  }

  handleDialogOpen() {
    this.setState({ modal: !this.state.modal });
  }

  handleDialogCancel() {
    this.setState({ slideId: null, elementId: null, modal: false });
  }

  handleDialogMove() {
    translateUIToData(this.state.element, this.state.presentation);
    MoveObject(
      this.state.presentation.presentationId,
      this.state.elementId,
      this.state.element.data,
      () => {
        this.setState({ slideId: null, elementId: null, modal: false });
        RefreshSlides(
          this.state.presId,
          this.handleRefreshPresentaton.bind(this)
        );
      }
    );
  }

  // arrange dialog
  handleArrangeDialogOpen() {
    this.setState({ arrangeModal: !this.state.arrangeModal });
  }

  handleArrangeDialogCancel() {
    this.setState({ slideId: null, arrangeModal: false });
  }

  handleArrangeDialogDo() {
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
            RefreshSlides(
              this.state.presId,
              this.handleRefreshPresentaton.bind(this)
            );
          }
        );
      });
  }

  // reset dialog
  handleResetDialogOpen() {
    this.setState({ resetModal: !this.state.resetModal });
  }

  handleResetDialogCancel() {
    this.setState({ slideId: null, resetModal: false });
  }

  handleResetDialogDo() {
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
        RefreshSlides(
          this.state.presId,
          this.handleRefreshPresentaton.bind(this)
        );
        this.setState({ resetModal: false });
      }
    );
  }

  // utils
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

  componentDidMount() {
    const connected = localStorage.getItem('connected');
    const presentation = localStorage.setItem(
      'presentation',
      JSON.stringify(presentation)
    );
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
          handleGetPresentationInfo={this.handleGetPresentationInfo}
          handleDialogOpen={this.handleDialogOpen}
          handleArrangeDialogOpen={this.handleArrangeDialogOpen}
          handleResetDialogOpen={this.handleResetDialogOpen}
          presentation={this.state.presentation}
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
            handleMoveElementProperty={this.handleMoveElementProperty}
          />
        </Dialog>
        <Dialog
          buttonLabel={'Arrange'}
          title={'Arrange Elements'}
          handleCancel={this.handleArrangeDialogCancel}
          handleMove={this.handleArrangeDialogDo}
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
          handleMove={this.handleResetDialogDo}
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
