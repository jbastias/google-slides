import React from 'react';
import JSONTree from 'react-json-tree';

const Tree = props => {
  if (
    Object.keys(props.data).length === 0 &&
    props.data.constructor === Object
  ) {
    return null;
  }
  return <JSONTree data={props.data} />;
};

export default Tree;
