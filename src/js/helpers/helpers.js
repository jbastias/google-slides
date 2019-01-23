import { getUnitsTable, toDataUnit, toUIUnit, getGoogleElementType } from '.';
import { find, propEq, path } from 'ramda';

export const translateUIToData = (element, presention) => {
  if (element.unit === 'EMU') {
    element.data = element.UI;
    element.data.scaleX = element.UI.scaleX / element.size.width.magnitude;
    element.data.scaleY = element.UI.scaleY / element.size.height.magnitude;
  } else {
    element.data.translateX = toDataUnit(
      getUnitsTable(presention),
      element.unit,
      element.UI.translateX,
      'x'
    );
    element.data.translateY = toDataUnit(
      getUnitsTable(presention),
      element.unit,
      element.UI.translateY,
      'y'
    );
    element.data.scaleX = toDataUnit(
      getUnitsTable(presention),
      element.unit,
      element.UI.scaleX / element.size.width.magnitude,
      'x'
    );
    element.data.scaleY = toDataUnit(
      getUnitsTable(presention),
      element.unit,
      element.UI.scaleY / element.size.height.magnitude,
      'y'
    );
  }
};

export const tranlateDataToUI = (ev, element, presention) => {
  if (ev.target.name === 'unit') {
    element[ev.target.name] = ev.target.value;
    element.UI.translateX = toUIUnit(
      getUnitsTable(presention),
      element.unit,
      element.data.translateX,
      'x'
    );
    element.UI.translateY = toUIUnit(
      getUnitsTable(presention),
      element.unit,
      element.data.translateY,
      'y'
    );
    element.UI.scaleX = toUIUnit(
      getUnitsTable(presention),
      element.unit,
      element.data.scaleX * element.size.width.magnitude,
      'x'
    );
    element.UI.scaleY = toUIUnit(
      getUnitsTable(presention),
      element.unit,
      element.data.scaleY * element.size.height.magnitude,
      'y'
    );
  } else {
    element.UI[ev.target.name] = ev.target.value;
  }
  return Object.assign({}, element);
};

export const getSlide = (presentation, slideId) =>
  presentation.slides.filter(slide => slide.objectId === slideId)[0];

export const getElement = (slide, elementId) => {
  return !slide.pageElements
    ? null
    : slide.pageElements.filter(obj => obj.objectId === elementId)[0];
};

export const getElementProp = (presentation, slideId, elementId, _path) => {
  const slide = find(propEq('objectId', slideId))(presentation.slides);
  const el = find(propEq('objectId', elementId))(slide.pageElements);
  return path(_path, el);
};

export const getElementInfo = element => {
  return {
    type: getGoogleElementType(element),
    unit: element.transform.unit,
    size: element.size,
    data: {
      scaleX: element.transform.scaleX || 0,
      scaleY: element.transform.scaleY || 0,
      shearX: element.transform.shearX || 0,
      shearY: element.transform.shearY || 0,
      translateX: element.transform.translateX || 0,
      translateY: element.transform.translateY || 0,
    },
    UI: {
      scaleX: element.transform.scaleX * element.size.width.magnitude || 0,
      scaleY: element.transform.scaleY * element.size.height.magnitude || 0,
      shearX: element.transform.shearX || 0,
      shearY: element.transform.shearY || 0,
      translateX: element.transform.translateX || 0,
      translateY: element.transform.translateY || 0,
    },
  };
};
