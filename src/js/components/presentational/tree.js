import React from 'react';
import JSONTree from 'react-json-tree';

const Tree = props => {
  if (
    Object.keys(props.data).length === 0 &&
    props.data.constructor === Object
  ) {
    return null;
  }
  return (
    <div style={{ width: '100%', height: '10' }}>
      <JSONTree data={props.data} />
    </div>
  );
};

export default Tree;
