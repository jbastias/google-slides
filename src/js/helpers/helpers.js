export const getUnitsTable = presentation => {
  const width = presentation.pageSize.width.magnitude;
  const height = presentation.pageSize.height.magnitude;
  return {
    CM: 1 / 360000,
    IN: 1 / 914400,
    PT: 1 / 12700,
    PX: 1 / 9525,
    FRACTION: { x: 1 / width, y: 1 / height },
    EMU: 1,
  };
};

export const toDataUnit = (unitsTbl, unit, value, direction) => {
  if (unit === 'FRACTION') {
    return value / unitsTbl[`${unit}`][`${direction}`];
  } else {
    return value / unitsTbl[unit];
  }
};

export const toUIUnit = (unitsTbl, unit, value, direction) => {
  if (unit === 'FRACTION') {
    return value * unitsTbl[`${unit}`][`${direction}`];
  } else {
    return value * unitsTbl[unit];
  }
};

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
  // console.log(JSON.stringify(element, null, 2));

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

export const getElementInfo = element => {
  let type = 'DEFAULT_TYPE';
  const keys = Object.keys(element);
  if (keys.includes('shape')) type = element.shape.shapeType;
  if (keys.includes('video')) type = 'video';
  if (keys.includes('image')) type = 'image';
  if (keys.includes('table')) type = 'table';
  if (keys.includes('sheetsChart')) type = 'sheetsChart';
  if (keys.includes('line')) type = 'line';

  // console.log(JSON.stringify(element, null, 2));

  return {
    type,
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

// ==============

const CATEGORY_TEXT = 0;
const CATEGORY_MEDIA = 1;
const CATEGORY_DATA = 2;

const SECTION_HEADER = 0;
const SECTION_BODY = 1;
const SECTION_FILL = 2;

const NATURAL_WIDTH_OPTION_NONE = 0;
const NATURAL_WIDTH_OPTION_MIN = 1;
const NATURAL_WIDTH_OPTION_MAX = 3;

const getCategory = el => {
  if (el.shape && el.shape.shapeType === 'TEXT_BOX') return CATEGORY_TEXT;
  return CATEGORY_MEDIA;
};

const getSelection = el => {
  return SECTION_BODY;
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

const getElementType = element => {
  /*
  heading
  paragraph
  image
  icon
  chart-pie
  chart-line
  chart-bar
  table
  video
  */

  const keys = Object.keys(element);
  if (keys.includes('shape') && element.shape.shapeType === 'TEXT_BOX')
    return 'paragraph';
  if (keys.includes('video')) return 'video';
  if (keys.includes('image')) return 'image';
  if (keys.includes('table')) return 'table';
  if (keys.includes('sheetsChart')) return 'chart-pie';
  return 'image';
};

const addImageSize = (el, pres) => {
  // console.log(JSON.stringify(el, null, 2));
  const sizes = {};

  for (let i = 3; i <= 12; i++) {
    const w = i / 12;
    const h =
      ((w * el.size.height.magnitude) / el.size.width.magnitude) *
      (pres.pageSize.width.magnitude / pres.pageSize.height.magnitude);
    sizes[i] = { w, h };
  }

  return sizes;
};

const getTextStyle = textEl => {
  // console.log('textRun: ', textEl);
  return {
    fontFamily: textEl.textRun.style.fontFamily,
    fontSize: textEl.textRun.style.fontSize.magnitude,
  };
};

const createTextDiv = (text, styles, width, slideWidth) => {
  const containerDiv = document.createElement('div');
  containerDiv.style = `border: solid 0px red; width: ${slideWidth}px; position: absolute; left: -2000px;`;
  document.body.append(containerDiv);

  const div = document.createElement('div');
  div.style = `border: solid 0px red; width: ${width * 100}%; font-size: ${
    styles.fontSize
  }pt; font-family: ${styles.fontFamily}`;
  div.innerHTML = text;
  containerDiv.append(div);
  const rect = div.getBoundingClientRect();
  document.body.removeChild(containerDiv);
  return rect;
};

const getSlidewidthInPx = presentation => {
  return toUIUnit(
    getUnitsTable(presentation),
    'PX',
    presentation.pageSize.width.magnitude,
    'x'
  );
};

const addTextSize = (el, pres) => {
  // console.log(JSON.stringify(el, null, 2));
  let text = '';

  const textEls = el.shape.text.textElements.filter(
    obj =>
      obj.hasOwnProperty('textRun') || obj.hasOwnProperty('paragraphMarker')
  );

  const styles = getTextStyle(textEls[1]);

  textEls.forEach((textEl, index) => {
    if (index === 0) return;
    if (textEl.hasOwnProperty('paragraphMarker')) text = text + '<br>';
    if (textEl.hasOwnProperty('textRun')) text = text + textEl.textRun.content;
  });

  const sizes = {};

  for (let i = 4; i <= 24; i++) {
    const w = i / 24;
    const rect = createTextDiv(text, styles, w, getSlidewidthInPx(pres));
    const h =
      rect.height /
      toUIUnit(getUnitsTable(pres), 'PX', pres.pageSize.height.magnitude);
    sizes[i] = { w, h };
  }

  return sizes;
};

const addSize = (el, pres) => {
  const type = getElementType(el);
  if (type === 'image') return addImageSize(el, pres);
  if (type === 'paragraph') return addTextSize(el, pres);
  return {};
};

const makeElement = presentation => el => {
  // console.log(JSON.stringify(el, null, 2));
  const t = getElementType(el);

  const obj = {
    id: el.objectId,
    metadata: {
      type: getElementType(el),
      category: getCategory(el),
      section: getSelection(el),
    },
    style: getStyle(el),
    originalStyle: getStyle(el),
    naturalSize: getSize(el),
    sizes: addSize(el, presentation),
  };

  if (t === 'image') {
    obj.metadata['aspectRatio'] =
      el.size.width.magnitude / el.size.height.magnitude;
    obj.metadata['autoHeight'] = true;
  }

  if (t === 'paragraph') {
    obj.metadata['autoHeight'] = true;
  }

  return obj;
};

export const elements = (elements, presentation) => {
  return elements.map(makeElement(presentation));
};
