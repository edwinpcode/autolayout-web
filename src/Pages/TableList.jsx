import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  handleGetListData,
  handleGetListStructure,
  handleStructureHeader,
} from '../Utils/TableUtils'
import { setCurrentPayload, setFilteringList } from '../Store/List/listSlice'
import TableComponent from '../Components/Table/TableComponent'
import { useParams } from 'react-router-dom'
import AutoLayout from './AutoLayout'
import Inbox from '../Components/Inbox'
import { createColumnHelper } from '@tanstack/react-table'
import FullLoad from './FullLoad'

function TableList() {
  const [loader, showLoader, hideLoader] = FullLoad()
  const { menuId } = useParams()
  const dispatch = useDispatch()
  const columnHelper = createColumnHelper()
  // state
  const [dataQuery, setDataQuery] = useState()
  const [structures, setStructures] = useState({})
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [count, setCount] = useState(0)
  // redux state
  // const menu = useSelector((state) => state.menu)
  const user = useSelector((state) => state.user)
  const filtering = useSelector((state) => state.list.filtering)

  const columnVisibility = useMemo(
    () => structures.headerVisibility,
    [structures]
  )
  const [rowSelection, setRowSelection] = useState({})

  const fetchData = async (menuId, pageIndex, pageSize, filtering) => {
    try {
      const payload = {
        userId: user.id,
        menuId: menuId,
        moduleId: user.activeModule.id,
        roleId: user.activeRole.id,
        filtering: filtering?.length ? filtering : [{ id: '', value: '' }],
        pagination: {
          pageIndex: pageIndex + 1,
          perPage: pageSize,
        },
      }
      dispatch(setCurrentPayload(payload))
      const res = handleGetListData(payload, setDataQuery)
    } catch (error) {
      hideLoader()
    }
  }

  const columns = useMemo(() => {
    return handleStructureHeader({
      structures,
      columnHelper,
      setDataQuery,
      fetchData,
      pageIndex,
      pageSize,
    })
  }, [structures])

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  )

  useEffect(() => {
    return () => {
      dispatch(setFilteringList([])) // reset filter when the component unmounts
    }
  }, [dispatch])

  // get structure
  useEffect(() => {
    if (menuId) {
      setPagination({ pageIndex: 0, pageSize: 10 })
      handleGetListStructure(user, menuId, setStructures)
      console.log('structure')
    }
  }, [menuId])

  // get data
  useEffect(() => {
    console.log('fetch')
    if (menuId) fetchData(menuId, pageIndex, pageSize, filtering)
  }, [menuId, pageIndex, pageSize, filtering])

  return (
    <div>
      <div className="d-md-flex">
        <Inbox
          pageIndex={pageIndex}
          pageSize={pageSize}
          fetchData={fetchData}
          pagination={pagination}
          setPagination={setPagination}
          columns={columns}
          dataQuery={dataQuery}
          setDataQuery={setDataQuery}
          structures={structures}
          setStructures={setStructures}
          columnVisibility={columnVisibility}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        {/* <TableComponent
          dataQuery={dataQuery}
          structures={structures}
          columnVisibility={columnVisibility}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setDataQuery={setDataQuery}
          setStructures={setStructures}
          setPagination={setPagination}
          fetchData={fetchData}
        /> */}
        <AutoLayout
          className="ml-md-3 mt-3 mt-md-0"
          fetchData={fetchData}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}

export default TableList
