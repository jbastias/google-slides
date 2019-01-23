import { getGoogleElementType } from '.';

export function GetPresentationInfo(presentation) {
  const slides = presentation.slides;
  slides.forEach(s => {
    const slideInfo = [];

    s.pageElements &&
      s.pageElements.forEach(o => {
        const info = {};

        info['type'] = getGoogleElementType(o);

        Object.keys(o).forEach(key => {
          if (key === 'objectId') {
            info['objetctId'] = o[key];
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
