import { GRID_CONFIG } from 'evo';
import { toUIUnit, getElementType, makePresObj, CENTER } from '.';

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

const addImageSize = (p, e) => {
  const sizes = {};
  for (
    let i = GRID_CONFIG[CATEGORY_MEDIA].cols.min;
    i <= GRID_CONFIG[CATEGORY_MEDIA].cols.size;
    i++
  ) {
    const w = i / GRID_CONFIG[CATEGORY_MEDIA].cols.size;
    const h = ((w * e.height) / e.width) * (p.slideWidth / p.slideHeight);
    sizes[i] = { w, h };
  }
  return sizes;
};

const createTextDiv = (content, width, slideWidth) => {
  const containerDiv = document.createElement('div');
  containerDiv.style = `border: solid 0px red; width: ${slideWidth}px; position: absolute;`;
  document.body.append(containerDiv);
  const div = document.createElement('div');
  div.style = `padding: ${CENTER}px; border: solid 1px red; width: ${width *
    100}%;`;
  div.innerHTML = content;
  containerDiv.append(div);
  const rect = div.getBoundingClientRect();
  document.body.removeChild(containerDiv);
  return rect;
};

const getTextStyle = textEl => {
  const style = textEl.textRun.style;
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize.magnitude,
    fontSizeUnit: style.fontSize.unit,
    bold: style.bold,
    italic: style.italic,
  };
};

const createSpan = textEl => {
  const style = getTextStyle(textEl);
  let el = '<span style="';
  el = el + 'font-famliy: ' + style.fontFamily + '; ';
  el = el + 'font-size: ' + style.fontSize + 'pt; ';
  el + style.bold ? 'font-weight: bold; ' : '';
  el + style.italic ? 'font-style: italic; ' : '';
  el + '>';
  el = textEl.textRun.content;
  el + '</span>';
  return el;
};

const createContent = el => {
  let content = '';

  if (el.shape.text) {
    const textEls = el.shape.text.textElements.filter(
      obj =>
        obj.hasOwnProperty('textRun') || obj.hasOwnProperty('paragraphMarker')
    );

    textEls.forEach((textEl, index) => {
      if (index === 0) return;
      if (textEl.hasOwnProperty('paragraphMarker'))
        content = content + '<br><br>';
      if (textEl.hasOwnProperty('textRun'))
        content = content + createSpan(textEl);
    });

    if (textEls.length == 2) {
      content = content + '<br><br>';
    }
  }

  return content;
};

const addTextSize = (p, e) => {
  const sizes = {};

  for (
    let i = GRID_CONFIG[CATEGORY_TEXT].cols.min;
    i <= GRID_CONFIG[CATEGORY_TEXT].cols.size;
    i++
  ) {
    const w = i / GRID_CONFIG[CATEGORY_TEXT].cols.size;
    const rect = createTextDiv(createContent(e.element), w, p.slideWidthInPx);
    const h = rect.height / toUIUnit(p.unitsTable, 'PX', p.slideHeight);
    sizes[i] = { w, h };
  }
  return sizes;
};

const addSize = (p, e) => {
  if (e.type === 'image') return addImageSize(p, e);
  if (e.type === 'paragraph') return addTextSize(p, e);
  return {};
};

const makeElement = (presentation, slideId) => el => {
  const t = getElementType(el);
  const p = makePresObj(presentation);
  const e = p.el(slideId, el.objectId);

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
    sizes: addSize(p, e),
  };

  if (t === 'image') {
    obj.metadata['aspectRatio'] = e.width / e.height;
    obj.metadata['autoHeight'] = true;
  }

  if (t === 'paragraph') {
    obj.metadata['autoHeight'] = true;
  }

  return obj;
};

export const makeElements = (elements, presentation, slideId) => {
  return elements.map(makeElement(presentation, slideId));
};
