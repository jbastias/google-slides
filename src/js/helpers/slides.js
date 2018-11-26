const PRES_ID = '1wtG0Wvt_p7Qrziu-D1LODmB1irORHiHo4UxGR3q2Dfg';

export function GetMoveStuff(presentation, cb) {
  const slides = presentation.slides;
  const slide = slides[slides.length - 1];
  const shape = slide.pageElements[0];
  // console.log(shape.transform.scaleX);
  // console.log(shape.transform.scaleY);
  const requests = [
    {
      updatePageElementTransform: {
        objectId: shape.objectId,
        transform: {
          scaleX: shape.transform.scaleX,
          scaleY: shape.transform.scaleY,
          shearX: 0,
          shearY: 0,
          translateX: 2540000,
          translateY: 0,
          unit: 'EMU',
        },
        applyMode: 'ABSOLUTE',
      },
    },
  ];

  // Execute the request.
  gapi.client.slides.presentations
    .batchUpdate({
      presentationId: PRES_ID,
      requests: requests,
    })
    .then(createSlideResponse => {
      console.log(JSON.stringify(createSlideResponse, null, 2));
      console.log(
        `Move slide shape revision id: ${
          createSlideResponse.result.writeControl.requiredRevisionId
        }`
      );
      cb(createSlideResponse.result);
    });
}

export function GetShapes(presentation) {
  // console.log(JSON.stringify(presentation, null, 2));
  const slides = presentation.slides;
  slides.forEach(s => {
    // console.log(s.objectId);
    const slideInfo = [];
    s.pageElements.forEach(o => {
      // console.log(`  ${JSON.stringify(o)}`);
      const info = {};
      Object.keys(o).forEach(key => {
        if (key === 'objectId') {
          info['objetctId'] = o[key];
        }

        if (key === 'shape') {
          info['shapeType'] = o[key].shapeType;
        }

        if (key === 'transform') {
          Object.keys(o[key]).forEach(k => {
            info[k] = o.transform[k];
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
  console.log(id);
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
      // shapeType: 'RECTANGLE',
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
        // console.log(presentation);
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
    // createShape(pageId, createSize(10)),
    // createShape(pageId, createSize(100), createTransform(1, 1, 100, 100)),
    // createShape(pageId, createSize(100), createTransform(1, 1, 200, 200)),
    // createShape(pageId, createSize(100), createTransform(1, 1, 300, 300)),
  ];

  // Execute the request.
  gapi.client.slides.presentations
    .batchUpdate({
      presentationId: PRES_ID,
      requests: requests,
    })
    .then(createSlideResponse => {
      console.log(
        `Created slide with ID: ${
          createSlideResponse.result.replies[0].createSlide.objectId
        }`
      );
      cb(createSlideResponse.result);
    });
}
