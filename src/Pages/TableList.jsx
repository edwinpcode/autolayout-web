import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetListData, handleGetListStructure } from '../Utils/TableUtils'
import { setCurrentPayload, setFilteringList } from '../Store/List/listSlice'
import TableComponent from '../Components/Table/TableComponent'
import { useParams } from 'react-router-dom'

function TableList() {
  const { menuId } = useParams()
  const dispatch = useDispatch()
  // state
  const [dataQuery, setDataQuery] = useState()
  const [structures, setStructures] = useState({})
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  // redux state
  const menu = useSelector((state) => state.menu)
  const user = useSelector((state) => state.user)
  const filtering = useSelector((state) => state.list.filtering)

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
    if (menu.activeMenuId !== '') {
      console.log(menu)
      setPagination({ pageIndex: 0, pageSize: 10 })
      handleGetListStructure(user, menu, setStructures)
    }
  }, [menu.activeMenuId])

  const fetchData = async (menuId, pageIndex, pageSize) => {
    try {
      const payload = {
        userId: user.id,
        menuId: menu.activeMenuId,
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
    } catch (error) {}
  }

  // get data
  useEffect(() => {
    if (menu.activeMenuId !== '') {
      fetchData(menu.activeMenuId, pageIndex, pageSize)
    }
  }, [menu.activeMenuId, pageIndex, pageSize])

  return (
    <div>
      <TableComponent
        dataQuery={dataQuery}
        structures={structures}
        columnVisibility={columnVisibility}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setDataQuery={setDataQuery}
        setStructures={setStructures}
        setPagination={setPagination}
      />
    </div>
  )
}

export default TableList
