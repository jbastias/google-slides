import React, { Component } from 'react';
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
        <Button
          onClick={props.handleCreateSlide}
          color="success"
          size="sm"
          className="m-1"
        >
          Create Slide
        </Button>

        <Button
          onClick={props.handleGetShapes}
          color="success"
          size="sm"
          className="m-1"
        >
          Get Shapes
        </Button>

        <Button
          onClick={props.handleMoveShape}
          color="success"
          size="sm"
          className="m-1"
        >
          Move Shape
        </Button>
      </>
    )}
  </div>
);

export default TheNav;
