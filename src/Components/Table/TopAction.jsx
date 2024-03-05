import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import ButtonType from "../AutoLayout/ButtonType"

function TopAction({
  structures,
  setStructures,
  setDataQuery,
  gridItem,
  getValues,
  pageIndex,
  pageSize,
  fetchData,
  filterData,
  setFilterData,
  filterDataLabel,
  selected = [],
  setTab,
  setAutoOpenFirstItem,
  ...props
}) {
  const activeMenuId = useSelector((state) => state.menu.activeMenuId)
  const activeTabId = useSelector((state) => state.menu.activeTabId)

  // useEffect(() => {
  //   setFilterData([])
  // }, [activeMenuId])

  return (
    <div className="mb-2 row">
      <div className="col-md-12">
        {filterDataLabel && (
          <div className="callout callout-danger">
            <p>{filterDataLabel}</p>
          </div>
        )}
      </div>
      <div className="col-md-12 d-flex align-items-center justify-content-end">
        {structures?.topAction?.map((buttonItem, index) => (
          <ButtonType
            key={index}
            filterData={filterData}
            buttonItem={buttonItem}
            gridItem={gridItem}
            setStructures={setStructures}
            setDataQuery={setDataQuery}
            setFilterData={setFilterData}
            getValues={getValues}
            pageIndex={pageIndex}
            pageSize={pageSize}
            fetchData={fetchData}
            selected={selected}
            setTab={setTab}
            setAutoOpenFirstItem={setAutoOpenFirstItem}
          />
        ))}
      </div>
    </div>
  )
}

export default TopAction
