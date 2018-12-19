import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Tree from './tree';

const getCategory = el => {
  if (el.shape && el.shape.shapeType === 'TEXT_BOX') return 'Text';
  return 'Media';
};

const getSelection = el => {
  return 'Body';
};

const getStyle = el => {
  return {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
};

const getSize = el => {
  return {
    w: 0,
    h: 0,
  };
};

const makeElement = el => {
  console.log(JSON.stringify(el, null, 2));
  return {
    id: el.objectId,
    metadata: {
      type: 'string',
      category: getCategory(el),
      section: getSelection(el),
    },
    style: getStyle(el),
    originalStyle: getStyle(el),
    naturalSize: getSize(el),
    sizes: {
      ['one']: getSize(el),
    },
  };
};

const elements = elements => {
  return elements.map(makeElement);
};

const slide = ({ slideId, presentation }) => {
  if (!slideId) null;
  const s = presentation.slides.filter(s => {
    return s.objectId === slideId;
  })[0];

  return <Tree data={elements(s.pageElements)} />;
};

const ArrangeForm = ({ presentation, slideId, pickSlide }) => {
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
          {slide({ slideId, presentation })}
        </FormGroup>
      ) : null}
    </Form>
  );
};

export default ArrangeForm;
