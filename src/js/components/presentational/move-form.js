import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
} from 'reactstrap';

const elements = ({ slideId, presentation }) => {
  if (!slideId) null;
  const s = presentation.slides.filter(s => {
    // console.log(s.objectId, slide, s.objectId === slide);
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
  // console.log(elementId);

  return !slide.pageElements
    ? null
    : slide.pageElements.filter(obj => obj.objectId === elementId)[0];
};

export const getElementInfo = element => {
  // console.log(JSON.stringify(element));

  let type = 'DEFAULT_TYPE';
  const keys = Object.keys(element);
  if (keys.includes('shape')) type = element.shape.shapeType;
  if (keys.includes('video')) type = 'video';
  if (keys.includes('image')) type = 'image';
  if (keys.includes('table')) type = 'table';
  if (keys.includes('sheetChart')) type = 'sheetChart';
  if (keys.includes('line')) type = 'line';

  return {
    type,
    unit: element.size.width.unit,
    // width: element.size.width.magnitude,
    // height: element.size.height.magnitude,
    scaleX: element.transform.scaleX,
    scaleY: element.transform.scaleY,
    shearX: element.transform.shearX,
    shearY: element.transform.shearY,
    translateX: element.transform.translateX,
    translateY: element.transform.translateY,
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
          <span className="font-weight-bold">ElId: </span>
          <span className="text-primary">{elementId}</span>
        </Col>
      </Row>

      <Row>
        <Col>Element</Col>
        <Col>
          <Input
            type="text"
            name="unit"
            id="unit"
            readOnly
            defaultValue={elementInfo.type}
          />
        </Col>
      </Row>
      <Row>
        <Col>Unit</Col>
        <Col>
          <Input
            type="text"
            name="unit"
            id="unit"
            defaultValue={elementInfo.unit}
          />

          {/* <Input readOnly type="select" name="unit" id="unit">
              <option defaultValue="EMU" value="EMU">
                EMU
              </option>
              <option value="PT">PT</option>
              <option value="PX">PX</option>
            </Input> */}
        </Col>
      </Row>
      {/* <Row>
        <Col>Width</Col>
        <Col>
          <Input
            type="text"
            name="width"
            id="width"
            defaultValue={elementInfo.width || 0}
          />
        </Col>
      </Row>
      <Row>
        <Col>Height</Col>
        <Col>
          <Input
            type="text"
            name="height"
            id="height"
            defaultValue={elementInfo.height || 0}
          />
        </Col>
      </Row> */}

      <Row>
        <Col>ScaleX</Col>
        <Col>
          <Input
            type="text"
            name="scaleX"
            id="scaleX"
            defaultValue={elementInfo.scaleX || 0}
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
            defaultValue={elementInfo.scaleY || 0}
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
            defaultValue={elementInfo.translateX || 0}
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
            defaultValue={elementInfo.translateY || 0}
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
            defaultValue={elementInfo.shearX || 0}
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
            defaultValue={elementInfo.shearY || 0}
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
