import React from 'react';
import { Button } from 'reactstrap';

const TheNav = props => (
  <div style={{ border: 'solid 0px black', width: '100%' }}>
    {!props.authorized ? (
      <Button
        onClick={props.handleSignIn}
        color="primary"
        size="sm"
        className="m-1"
      >
        Authorize
      </Button>
    ) : (
      <>
        <Button
          onClick={props.handleSignOut}
          color="secondary"
          size="sm"
          className="m-1"
        >
          Sign Out
        </Button>

        <Button
          onClick={props.handleRefreshSlide}
          color="danger"
          size="sm"
          className="m-1"
        >
          Refresh Slide
        </Button>
      </>
    )}

    {props.authorized && Object.keys(props.presentation).length ? (
      <>
        <Button
          onClick={props.handleCreateSlide}
          color="success"
          size="sm"
          className="m-1"
        >
          Create Slide
        </Button>

        <Button
          onClick={props.handleGetPresentationInfo}
          color="success"
          size="sm"
          className="m-1"
        >
          Get Pres Info
        </Button>

        <Button
          onClick={props.handleDialogOpen}
          color="success"
          size="sm"
          className="m-1"
        >
          Move Element
        </Button>

        <Button
          onClick={props.handleArrangeDialogOpen}
          color="success"
          size="sm"
          className="m-1"
        >
          Arrange Elements
        </Button>

        <Button
          onClick={props.handleResetDialogOpen}
          color="success"
          size="sm"
          className="m-1"
        >
          Reset Elements
        </Button>
      </>
    ) : null}
  </div>
);

export default TheNav;
