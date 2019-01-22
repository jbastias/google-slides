import { find, propEq, path } from 'ramda';
import { toDataUnit, getUnitsTable } from '../helpers/helpers';

const PRES_ID = '1wtG0Wvt_p7Qrziu-D1LODmB1irORHiHo4UxGR3q2Dfg';

const getElementProp = (presentation, slideId, elementId, _path) => {
  const slide = find(propEq('objectId', slideId))(presentation.slides);
  const el = find(propEq('objectId', elementId))(slide.pageElements);
  return path(_path, el);
};

const updatePresentation = (presentationId, requests, cb) => {
  if (!requests.length) return cb();

  return gapi.client.slides.presentations
    .batchUpdate({
      presentationId: presentationId,
      requests: requests,
    })
    .then(createSlideResponse => {
      console.log(
        `Move slide shape revision id: ${
          createSlideResponse.result.writeControl.requiredRevisionId
        }`
      );
      cb(createSlideResponse.result);
    })
    .catch(err => {
      cb(err.message);
    });
};

export function ResetObjectsSizes(presentation, slideId, elements, cb) {
  const requests = elements
    .filter(el => el.metadata.type === 'image')
    .map(el => {
      const translateX = getElementProp(presentation, slideId, el.id, [
        'transform',
        'translateX',
      ]);
      const translateY = getElementProp(presentation, slideId, el.id, [
        'transform',
        'translateY',
      ]);
      return {
        updatePageElementTransform: {
          objectId: el.id,
          transform: {
            scaleX: 381,
            scaleY: 381,
            shearX: 0,
            shearY: 0,
            translateX: translateX < 0 ? 1000000 : translateX,
            translateY: translateY < 0 ? 1000000 : translateY,
            unit: 'EMU',
          },
          applyMode: 'ABSOLUTE',
        },
      };
    });

  updatePresentation(presentation.presentationId, requests, cb);
}

const newScaleX = (presentation, slideId, el, pad) => {
  return (
    toDataUnit(getUnitsTable(presentation), 'FRACTION', el.style.w, 'x') /
      getElementProp(presentation, slideId, el.id, [
        'size',
        'width',
        'magnitude',
      ]) -
    (el.metadata.type === 'paragraph'
      ? 0
      : toDataUnit(getUnitsTable(presentation), 'PX', pad, 'x') /
        getElementProp(presentation, slideId, el.id, [
          'size',
          'width',
          'magnitude',
        ]))
  );
};

const newScaleY = (presentation, slideId, el, pad) => {
  return (
    toDataUnit(getUnitsTable(presentation), 'FRACTION', el.style.h, 'y') /
      getElementProp(presentation, slideId, el.id, [
        'size',
        'height',
        'magnitude',
      ]) -
    (el.metadata.type === 'paragraph'
      ? 0
      : toDataUnit(getUnitsTable(presentation), 'PX', pad, 'y') /
        getElementProp(presentation, slideId, el.id, [
          'size',
          'height',
          'magnitude',
        ]))
  );
};

const newTranslateX = (presentation, el, move) => {
  return (
    toDataUnit(getUnitsTable(presentation), 'FRACTION', el.style.x, 'x') +
    (el.metadata.type === 'paragraphXXX'
      ? 0
      : toDataUnit(getUnitsTable(presentation), 'PX', move, 'x'))
  );
};

const newTranslateY = (presentation, el, move) => {
  return (
    toDataUnit(getUnitsTable(presentation), 'FRACTION', el.style.y, 'y') +
    (el.metadata.type === 'paragraphXXX'
      ? 0
      : toDataUnit(getUnitsTable(presentation), 'PX', move, 'y'))
  );
};

export function AIMoveObjects(presentation, slideId, elements, cb) {
  const requests = elements.map(el => {
    return {
      updatePageElementTransform: {
        objectId: el.id,
        transform: {
          scaleX: newScaleX(presentation, slideId, el, 50),
          scaleY: newScaleY(presentation, slideId, el, 50),
          shearX: 0,
          shearY: 0,
          translateX: newTranslateX(presentation, el, 25),
          translateY: newTranslateY(presentation, el, 25),
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

  console.log(transform);

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

export function GetInfo(presentation) {
  const slides = presentation.slides;
  slides.forEach(s => {
    const slideInfo = [];

    s.pageElements &&
      s.pageElements.forEach(o => {
        const info = {};
        Object.keys(o).forEach(key => {
          if (key === 'objectId') {
            info['objetctId'] = o[key];
          }

          if (key === 'shape') {
            info['type'] = o[key].shapeType;
          }

          if (
            key === 'video' ||
            key === 'image' ||
            key === 'table' ||
            key === 'sheetsChart' ||
            key === 'line'
          ) {
            info['type'] = key;
          }

          if (key === 'transform') {
            Object.keys(o[key]).forEach(k => {
              info[k] = `${o.transform[k]}`;
            });
          }

          if (key === 'size') {
            Object.keys(o[key]).forEach(k => {
              const { magnitude, unit } = o.size[k];
              info[k] = `${magnitude} - ${unit}`;
            });
          }
        });

        slideInfo.push(info);
      });
    console.table(slideInfo);
  });
}

export function createObjectId() {
  const id = `obj-${Math.floor(Math.random() * 10000000000).toString()}`;
  return id;
}

export function createSlide(pageId) {
  return {
    createSlide: {
      objectId: pageId,
      slideLayoutReference: {
        predefinedLayout: 'BLANK',
      },
    },
  };
}

export function createSize(magnitude = 150, unit = 'PT') {
  return {
    height: {
      magnitude,
      unit,
    },
    width: {
      magnitude,
      unit,
    },
  };
}

export function createTransform(
  scaleX = 1,
  scaleY = 1,
  translateX = 0,
  translateY = 0,
  unit = 'PT'
) {
  return {
    scaleX,
    scaleY,
    translateX,
    translateY,
    unit,
  };
}

export function createShape(
  pageId,
  size,
  transform,
  type = 'RECTANGLE',
  text = ''
) {
  return {
    createShape: {
      objectId: createObjectId(),
      shapeType: type,
      elementProperties: {
        pageObjectId: pageId,
        size: size || createSize(),
        transform: transform || createTransform(),
      },
    },
  };
}

export function RefreshSlides(cb) {
  gapi.client.slides.presentations
    .get({
      presentationId: '1wtG0Wvt_p7Qrziu-D1LODmB1irORHiHo4UxGR3q2Dfg',
    })
    .then(
      function(response) {
        var presentation = response.result;
        var length = presentation.slides.length;
        PRES_OBJ.slides = length;
        cb(presentation);
      },
      function(response) {
        console.log('Error: ' + response.result.error.message);
      }
    );
}

export function CreateSlide(cb) {
  const pageId = createObjectId();

  var requests = [
    createSlide(pageId),
    createShape(pageId, createSize(100)),
    createShape(pageId, createSize(50)),
    createShape(pageId, createSize(100), createTransform(1, 1, 100, 100)),
    createShape(pageId, createSize(50), createTransform(1, 1, 200, 200)),
    createShape(pageId, createSize(150), createTransform(1, 1, 250, 250)),
    createShape(pageId, createSize(10), createTransform(1, 1, 400, 400)),
  ];

  updatePresentation(PRES_ID, requests, cb);
}
