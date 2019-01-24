import {
  toDataUnit,
  updatePresentation,
  makePresObj,
  PADDING,
  CENTER,
  IMAGE_SCALE,
  SHAPE_SCALE,
} from '.';

export function ResetObjectsSizes(presentation, slideId, elements, cb) {
  const p = makePresObj(presentation);
  const requests = elements
    .filter(el => el.metadata.type === 'image')
    .map(el => {
      const e = p.el(slideId, el.id);
      return {
        updatePageElementTransform: {
          objectId: el.id,
          transform: {
            scaleX:
              e.elementTypeInfo.type === 'shape' ? SHAPE_SCALE : IMAGE_SCALE,
            scaleY:
              e.elementTypeInfo.type === 'shape' ? SHAPE_SCALE : IMAGE_SCALE,
            shearX: 0,
            shearY: 0,
            translateX: e.translateX < 0 ? 1000000 : e.translateX,
            translateY: e.translateY < 0 ? 1000000 : e.translateY,
            unit: 'EMU',
          },
          applyMode: 'ABSOLUTE',
        },
      };
    });
  updatePresentation(presentation.presentationId, requests, cb);
}

const newScaleX = (p, e, el, pad) => {
  return (
    toDataUnit(p.unitsTable, 'FRACTION', el.style.w, 'x') / e.width -
    toDataUnit(p.unitsTable, 'PX', pad, 'x') / e.width
  );
};

const newScaleY = (p, e, el, pad) => {
  return (
    toDataUnit(p.unitsTable, 'FRACTION', el.style.h, 'y') / e.height -
    toDataUnit(p.unitsTable, 'PX', pad, 'y') / e.height
  );
};

const newTranslateX = (p, el, move) => {
  return (
    toDataUnit(p.unitsTable, 'FRACTION', el.style.x, 'x') +
    toDataUnit(p.unitsTable, 'PX', move, 'x')
  );
};

const newTranslateY = (p, el, move) => {
  return (
    toDataUnit(p.unitsTable, 'FRACTION', el.style.y, 'y') +
    toDataUnit(p.unitsTable, 'PX', move, 'x')
  );
};

export function AIMoveObjects(presentation, slideId, elements, cb) {
  const p = makePresObj(presentation);
  const requests = elements.map(el => {
    const e = p.el(slideId, el.id);
    return {
      updatePageElementTransform: {
        objectId: el.id,
        transform: {
          scaleX: newScaleX(p, e, el, PADDING),
          scaleY: newScaleY(p, e, el, PADDING),
          shearX: 0,
          shearY: 0,
          translateX: newTranslateX(p, el, CENTER),
          translateY: newTranslateY(p, el, CENTER),
          unit: 'EMU',
        },
        applyMode: 'ABSOLUTE',
      },
    };
  });
  updatePresentation(presentation.presentationId, requests, cb);
}

export function MoveObject(presentationId, objectId, transform, cb) {
  transform['unit'] = 'EMU';
  const requests = [
    {
      updatePageElementTransform: {
        objectId: objectId,
        transform,
        applyMode: 'ABSOLUTE',
      },
    },
  ];
  updatePresentation(presentationId, requests, cb);
}

export function RefreshSlides(presId, cb) {
  gapi.client.slides.presentations.get({ presentationId: presId }).then(
    function(response) {
      var presentation = response.result;
      cb(presentation);
    },
    function(response) {
      console.log('Error: ' + response.result.error.message);
    }
  );
}
