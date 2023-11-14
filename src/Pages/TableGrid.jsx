import { useEffect, useMemo, useState } from 'react'
import { handleGetGridData, handleGetGridStructure } from '../Utils/TableUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setFilteringList } from '../Store/List/listSlice'
import TableComponent from '../Components/Table/TableComponent'
import { handleParamValues } from '../Utils/ParamUtils'

function TableGrid({ gridItem, activeTabId, watch, getValues }) {
  const dispatch = useDispatch()
  // state
  const [dataQuery, setDataQuery] = useState()
  const [structures, setStructures] = useState({})
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  // redux
  const activeTrackId = useSelector((state) => state.menu.activeTrackId)
  // const filtering = useSelector((state) => state.list.filtering)
  const gridFilter = useSelector((state) => state.list.gridFilter)
  const refreshDataGrid = useSelector((state) => state.list.refreshGrid)
  // watch
  const watchInputParam = watch(gridItem.reference.parent[0])

  const columnVisibility = useMemo(
    () => structures.headerVisibility,
    [structures]
  )

  useEffect(() => {
    return () => {
      dispatch(setFilteringList([])) // reset filter when the component unmounts
    }
  }, [dispatch])

  // get structure
  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 10 })
    handleGetGridStructure(setStructures, gridItem, getValues)
  }, [activeTabId])

  // get data
  useEffect(() => {
    // console.log(1)
    const payload = {
      grid: gridItem.id,
      filtering: gridFilter,
      tc: activeTrackId,
      param: handleParamValues(gridItem.reference.parent, getValues),
      pagination: {
        pageIndex: pageIndex + 1,
        perPage: pageSize,
      },
    }
    handleGetGridData(payload, setDataQuery)
  }, [
    pageIndex,
    pageSize,
    activeTabId,
    watchInputParam,
    gridFilter,
    refreshDataGrid,
  ])

  return (
    <TableComponent
      dataQuery={dataQuery}
      structures={structures}
      columnVisibility={columnVisibility}
      pageIndex={pageIndex}
      pageSize={pageSize}
      gridItem={gridItem}
      setStructures={setStructures}
      setDataQuery={setDataQuery}
      setPagination={setPagination}
      getValues={getValues}
    />
  )
}

export default TableGrid
