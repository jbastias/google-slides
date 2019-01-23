export const updatePresentation = (presentationId, requests, cb) => {
  if (!requests.length) return cb();

  return gapi.client.slides.presentations
    .batchUpdate({
      presentationId: presentationId,
      requests: requests,
    })
    .then(createSlideResponse => {
      console.log(
        `updated presentation revision id: ${
          createSlideResponse.result.writeControl.requiredRevisionId
        }`
      );
      cb(createSlideResponse.result);
    })
    .catch(err => {
      cb(err.message);
    });
};
