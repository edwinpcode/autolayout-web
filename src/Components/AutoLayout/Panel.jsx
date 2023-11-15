import React from 'react'
import ButtonType from './ButtonType'

/* 
  note:
  isLastIndex: remove margin class (mb-5) for last index panel
  children: panel content 
*/
function Panel({
  id,
  name,
  hide,
  panelAction,
  panelList,
  panelItem,
  getValues,
  handleSubmit,
  children,
  pageSize,
  pageIndex,
  fetchData,
  gridItem,
}) {
  return (
    <div className={`col-md-${panelItem.width || '12'}`}>
      <div
        className={`card w-100 ${panelItem.className || 'card-danger'}`}
        id={id}
      >
        <div className="card-header">
          <h3 className="card-title">{name}</h3>
          <div className="card-tools m-0">
            {/* <button
              type="button"
              className="btn btn-tool"
              data-card-widget="maximize"
            >
              <i className="fas fa-expand"></i>
            </button> */}
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="collapse"
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">{children}</div>
        </div>
        {panelAction.length > 0 && (
          <div className="card-footer d-flex justify-content-end">
            {panelAction.map((actionItem, index) => (
              <ButtonType
                key={index}
                buttonItem={actionItem}
                panelList={panelList}
                getValues={getValues}
                handleSubmit={handleSubmit}
                saveEndpoint="/savedata"
                pageIndex={pageIndex}
                pageSize={pageSize}
                fetchData={fetchData}
                gridItem={gridItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Panel
