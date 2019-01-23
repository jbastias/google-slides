import { makePresObj } from '.';

export const getUnitsTable = presentation => {
  const p = makePresObj(presentation);
  return {
    CM: 1 / 360000,
    IN: 1 / 914400,
    PT: 1 / 12700,
    PX: 1 / 9525,
    FRACTION: { x: 1 / p.slideWidth, y: 1 / p.slideHeight },
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
