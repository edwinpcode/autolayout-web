import { Handle, Position } from 'reactflow';
import React from 'react';
import { inputHandleStyle } from './CustomHandleStyle';

// node circle shape with 1 input only
const EndEventNode = ({data, event}) => {
  return (
    <div className='circle bg-success p-1 d-flex border-dark border justify-content-center align-items-center'>
        <Handle style={inputHandleStyle} type="target" position={Position.Top}/>
        <div>{data.label}</div>
    </div>
  )
}

export default EndEventNode;
