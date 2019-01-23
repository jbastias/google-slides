export const getGoogleElementTypeInfo = element => {
  let type = 'image';
  let shapeType = null;
  const keys = Object.keys(element);
  if (keys.includes('shape')) {
    type = 'shape';
    shapeType = element.shape.shapeType;
  }
  if (keys.includes('video')) type = 'video';
  if (keys.includes('image')) type = 'image';
  if (keys.includes('table')) type = 'table';
  if (keys.includes('sheetsChart')) type = 'sheetsChart';
  if (keys.includes('line')) type = 'line';
  if (keys.includes('wordArt')) type = 'wordArt';
  return { type, shapeType };
};

export const getGoogleElementType = element => {
  const { type, shapeType } = getGoogleElementTypeInfo(element);
  if (type === 'shape') {
    return shapeType;
  }
  return type;
};

export const getElementType = element => {
  const { type, shapeType } = getGoogleElementTypeInfo(element);
  if (type === 'shape' && shapeType === 'TEXT_BOX') return 'paragraph';
  if (type === 'shape') return 'image';
  if (type === 'sheetsChart') return 'chart-pie';
  return type;
};
