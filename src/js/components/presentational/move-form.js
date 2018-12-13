import React from 'react';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';

const elements = ({ slideId, presentation }) => {
  if (!slideId) null;
  const s = presentation.slides.filter(s => {
    return s.objectId === slideId;
  })[0];

  return s.pageElements.map((obj, idx) => {
    return (
      <option value={obj.objectId} key={idx}>
        {obj.objectId}
      </option>
    );
  });
};

export const getSlide = (presentation, slideId) =>
  presentation.slides.filter(slide => slide.objectId === slideId)[0];

export const getElement = (slide, elementId) => {
  return !slide.pageElements
    ? null
    : slide.pageElements.filter(obj => obj.objectId === elementId)[0];
};

export const getElementInfo = element => {
  let type = 'DEFAULT_TYPE';
  const keys = Object.keys(element);
  if (keys.includes('shape')) type = element.shape.shapeType;
  if (keys.includes('video')) type = 'video';
  if (keys.includes('image')) type = 'image';
  if (keys.includes('table')) type = 'table';
  if (keys.includes('sheetChart')) type = 'sheetChart';
  if (keys.includes('line')) type = 'line';

  console.log(JSON.stringify(element, null, 2));

  return {
    type,
    unit: element.transform.unit,
    data: {
      scaleX: element.transform.scaleX || 0,
      scaleY: element.transform.scaleY || 0,
      shearX: element.transform.shearX || 0,
      shearY: element.transform.shearY || 0,
      translateX: element.transform.translateX || 0,
      translateY: element.transform.translateY || 0,
    },
    UI: {
      scaleX: element.transform.scaleX || 0,
      scaleY: element.transform.scaleY || 0,
      shearX: element.transform.shearX || 0,
      shearY: element.transform.shearY || 0,
      translateX: element.transform.translateX || 0,
      translateY: element.transform.translateY || 0,
    },
  };
};

const showElement = ({ slideId, elementId, elementInfo, handleMove }) => {
  return (
    <FormGroup>
      <Row>
        <Col>
          <span className="font-weight-bold">SlideId: </span>
          <span className="text-primary">{slideId}</span>
        </Col>
        <Col>
          <span className="font-weight-bold">ElementId: </span>
          <span className="text-primary">{elementId}</span>
        </Col>
      </Row>

      <Row>
        <Col>Element Type</Col>
        <Col>
          <Input
            type="text"
            name="unit"
            id="unit"
            readOnly
            value={elementInfo.type}
          />
        </Col>
      </Row>
      <Row>
        <Col>Unit</Col>
        <Col>
          <Input onChange={handleMove} type="select" name="unit" id="unit">
            <option value="EMU">EMU</option>
            <option value="PT">PT</option>
            <option value="PX">PX</option>
            <option value="CM">CM</option>
            <option value="IN">IN</option>
            <option value="FRACTION">FRACTION</option>
          </Input>
        </Col>
      </Row>
      <Row>
        <Col>ScaleX</Col>
        <Col>
          <Input
            type="text"
            name="scaleX"
            id="scaleX"
            value={elementInfo.UI.scaleX || 0}
            onChange={handleMove}
          />
        </Col>
      </Row>
      <Row>
        <Col>ScaleY</Col>
        <Col>
          <Input
            type="text"
            name="scaleY"
            id="scaleY"
            value={elementInfo.UI.scaleY || 0}
            onChange={handleMove}
          />
        </Col>
      </Row>
      <Row>
        <Col>TranslateX</Col>
        <Col>
          <Input
            type="text"
            name="translateX"
            id="translateX"
            value={elementInfo.UI.translateX || 0}
            onChange={handleMove}
          />
        </Col>
      </Row>
      <Row>
        <Col>TranslateY</Col>
        <Col>
          <Input
            type="text"
            name="translateY"
            id="translateY"
            value={elementInfo.UI.translateY || 0}
            onChange={handleMove}
          />
        </Col>
      </Row>
      <Row>
        <Col>ShearX</Col>
        <Col>
          <Input
            type="text"
            name="shearX"
            id="shearX"
            value={elementInfo.UI.shearX || 0}
            onChange={handleMove}
          />
        </Col>
      </Row>
      <Row>
        <Col>ShearY</Col>
        <Col>
          <Input
            type="text"
            name="shearY"
            id="shearY"
            value={elementInfo.UI.shearY || 0}
            onChange={handleMove}
          />
        </Col>
      </Row>
    </FormGroup>
  );
};

const MoveForm = ({
  presentation,
  slideId,
  elementId,
  pickSlide,
  pickElement,
  elementInfo,
  handleMove,
}) => {
  const slides = presentation.slides.map(slide => slide.objectId);

  return (
    <Form>
      <FormGroup>
        <Label for="slide">Slides</Label>
        <Input onChange={pickSlide} type="select" name="slides" id="slides">
          <option value="">select a slide</option>
          {slides.map(slide => (
            <option key={slide}>{slide}</option>
          ))}
        </Input>
      </FormGroup>

      {slideId ? (
        <FormGroup>
          <Label for="elements">Elements</Label>
          <Input
            onChange={pickElement}
            type="select"
            name="elements"
            id="elements"
          >
            <option value={null}>select an element</option>
            {elements({ slideId, presentation })}
          </Input>
        </FormGroup>
      ) : null}

      {slideId && elementId && elementInfo
        ? showElement({ slideId, elementId, elementInfo, handleMove })
        : null}
    </Form>
  );
};

export default MoveForm;
