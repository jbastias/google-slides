import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Tree from './tree';

const ArrangeForm = ({ presentation, slideId, pickSlide, slideElements }) => {
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

      {slideId && slideElements ? (
        <FormGroup>
          <Label for="elements">Elements</Label>
          <Tree data={slideElements} />
        </FormGroup>
      ) : null}
    </Form>
  );
};

export default ArrangeForm;
