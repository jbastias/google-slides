import { updatePresentation } from '.';

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

export function CreateSlide(presId, cb) {
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

  updatePresentation(presId, requests, cb);
}
