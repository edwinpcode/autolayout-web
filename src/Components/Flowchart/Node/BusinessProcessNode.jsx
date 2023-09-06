import React from 'react'
import { Handle, Position } from 'reactflow'
import { outputHandleStyle, inputHandleStyle } from './CustomHandleStyle'

// node type custom common shape
const BusinessProcessNode = ({ data, event }) => {
  return (
    <div className="px-1 py-1 border border-dark bg-danger rounded-sm">
      <Handle style={inputHandleStyle} type="target" position={Position.Top} />
      <div id="label" name="label">
        {data.label}
      </div>
      <Handle
        style={outputHandleStyle}
        type="source"
        position={Position.Bottom}
        id="a"
      />
    </div>
  )
}

export default BusinessProcessNode
