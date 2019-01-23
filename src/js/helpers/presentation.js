import {
  getSlide,
  getElement,
  getGoogleElementTypeInfo,
  getElementType,
  toUIUnit,
} from '.';
import { path } from 'ramda';

export const makePresObj = presentation => {
  return {
    get presentation() {
      return presentation;
    },
    get slideWidth() {
      return presentation.pageSize.width.magnitude;
    },
    get slideHeight() {
      return presentation.pageSize.height.magnitude;
    },
    get unitsTable() {
      return {
        CM: 1 / 360000,
        IN: 1 / 914400,
        PT: 1 / 12700,
        PX: 1 / 9525,
        FRACTION: { x: 1 / this.slideWidth, y: 1 / this.slideHeight },
        EMU: 1,
      };
    },
    get slideWidthInPx() {
      return toUIUnit(this.unitsTable, 'PX', this.slideWidth, 'x');
    },
    el(slideId, elementId) {
      const slide = getSlide(presentation, slideId);
      const element = getElement(slide, elementId);
      return {
        get element() {
          return element;
        },
        get translateX() {
          return element.transform.translateX || 0;
        },
        get translateY() {
          return element.transform.translateY || 0;
        },
        get scaleX() {
          return element.transform.scaleX || 0;
        },
        get scaleY() {
          return element.transform.scaleY || 0;
        },
        get shearX() {
          return element.transform.shearX || 0;
        },
        get shearY() {
          return element.transform.shearY || 0;
        },
        get width() {
          return element.size.width.magnitude || 0;
        },
        get height() {
          return element.size.height.magnitude || 0;
        },
        get elementTypeInfo() {
          return getGoogleElementTypeInfo(element);
        },
        get type() {
          return getElementType(element);
        },
        getElementProp(_path) {
          return path(_path, element);
        },
      };
    },
  };
};
