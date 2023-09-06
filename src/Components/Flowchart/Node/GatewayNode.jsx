import React from 'react';
import { Handle, Position } from 'reactflow';
import { inputHandleStyle, outputHandleStyle } from './CustomHandleStyle';


// node type diamond shape
const GatewayNode = ({data, event}) => {
  return (
    <div className='box'>
      <div className='content'>
        <Handle style={inputHandleStyle} type="target" position={Position.Top}/>
        <div id="label" name="label">{data.label}</div>
        <Handle style={outputHandleStyle} type="source" position={Position.Right} id="a"/>
        <Handle style={outputHandleStyle} type="source" position={Position.Left} id="b"/>
      </div>
    </div>
  )
}

export default GatewayNode;