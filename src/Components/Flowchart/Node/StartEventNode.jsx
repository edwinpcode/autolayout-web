import React from 'react';
import { Handle, Position } from 'reactflow';
import { outputHandleStyle } from './CustomHandleStyle';


// node circle shape with 1 output only
const StartEventNode = ({data, event}) => {
  return (
    <div className='circle p-1 bg-primary border border-dark d-flex justify-content-center align-items-center'>
      <div>{data.label}</div>
      <Handle style={outputHandleStyle} type="source" position={Position.Bottom} id="a"/>
    </div>
  )
}

export default StartEventNode