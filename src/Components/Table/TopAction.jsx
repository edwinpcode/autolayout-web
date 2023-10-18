import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import ButtonType from '../AutoLayout/ButtonType'

function TopAction({
  structures,
  setStructures,
  setDataQuery,
  gridItem,
  getValues,
  pageIndex,
  pageSize,
  fetchData,
}) {
  // state
  const [filterData, setFilterData] = useState([])
  // redux
  const activeMenuId = useSelector((state) => state.menu.activeMenuId)
  const activeTabId = useSelector((state) => state.menu.activeTabId)

  const filterDataLabel = useMemo(() => {
    const searchCriteria = []
    if (filterData) {
      filterData.forEach(({ label, value }) => {
        if (value !== '') searchCriteria.push(`${label} = ${value}`)
      })
      const res = searchCriteria.join(', ')
      return res
    }
    return filterData
  }, [filterData])

  useEffect(() => {
    setFilterData([])
  }, [activeMenuId, activeTabId])

  return (
    <div className="mb-2 row">
      <div className="col-md-12">
        {filterDataLabel && (
          <div className="callout callout-danger shadow-none">
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
          />
        ))}
      </div>
    </div>
  )
}

export default TopAction
