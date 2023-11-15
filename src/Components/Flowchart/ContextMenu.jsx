import React, { useEffect } from 'react'

// Mouse Right Click on Flowchart Diagram
const ContextMenu = ({ onDeleteClick, position, contextOpen }) => {
  if (contextOpen)
    return (
      <div
        className="bg-white border rounded-lg m-1 p-1"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex: 1000,
        }}
      >
        {/* <div className='d-flex justify-content-end'>
            <button className='btn btn-sm btn-light'>
                <i className="fal fa-bars" onClick={onClose} />
            </button>
            </div> */}
        <button
          className="btn btn-sm btn-secondary"
          data-target="#editElement"
          data-toggle="modal"
        >
          Ubah
        </button>
        <div></div>
        <button className="btn btn-danger btn-sm" onClick={onDeleteClick}>
          Hapus
        </button>
      </div>
    )
}

export default ContextMenu
