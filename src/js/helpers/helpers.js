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
