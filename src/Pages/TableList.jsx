import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleGetListData, handleGetListStructure } from "../Utils/TableUtils"
import { setCurrentPayload, setFilteringList } from "../Store/List/listSlice"
import { useLocation, useParams } from "react-router-dom"
import AutoLayout from "./AutoLayout"
import Inbox from "../Components/Inbox"
import FullLoad from "./FullLoad"

function TableList() {
  const [loader, showLoader, hideLoader] = FullLoad()
  // const { menuId } = useParams()
  const dispatch = useDispatch()
  const [structures, setStructures] = useState({})
  const menuSlice = useSelector((res) => res.menu)
  const { state, pathname } = useLocation()

  // state
  const [dataQuery, setDataQuery] = useState()
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const user = useSelector((state) => state.user)
  const filtering = useSelector((state) => state.list.filtering)

  const fetchData = async (menuId, pageIndex, pageSize, filtering) => {
    try {
      const payload = {
        userId: user.id,
        menuId: menuId,
        moduleId: user.activeModule.id,
        roleId: user.activeRole.id,
        filtering: filtering?.length ? filtering : [{ id: "", value: "" }],
        pagination: {
          pageIndex: pageIndex + 1,
          perPage: pageSize,
        },
      }
      dispatch(setCurrentPayload(payload))
      await handleGetListData(payload, setDataQuery)
    } catch (error) {
    } finally {
      hideLoader()
    }
  }

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  useEffect(() => {
    return () => {
      dispatch(setFilteringList([])) // reset filter when the component unmounts
    }
  }, [dispatch])

  // get structure
  useEffect(() => {
    if (menuSlice) {
      setPagination({ pageIndex: 0, pageSize: 10 })
      handleGetListStructure(user, menuSlice.activeMenuId, setStructures)
    }
  }, [menuSlice, user])

  // get data
  useEffect(() => {
    if (menuSlice)
      fetchData(menuSlice.activeMenuId, pageIndex, pageSize, filtering)
  }, [menuSlice, pageIndex, pageSize, filtering])

  return (
    <div>
      <div className="d-md-flex">
        <Inbox
          // className={"col-md-3"}
          pageIndex={pageIndex}
          pageSize={pageSize}
          fetchData={fetchData}
          setPagination={setPagination}
          dataQuery={dataQuery}
          setDataQuery={setDataQuery}
          structures={structures}
          setStructures={setStructures}
        />
        {/* <TableComponent
          dataQuery={dataQuery}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setDataQuery={setDataQuery}
          setPagination={setPagination}
          fetchData={fetchData}
          structures={structures}
          setStructures={setStructures}
        /> */}
        {pathname == "/form" && (
          <AutoLayout
            className="ml-md-3 mt-3 mt-md-0"
            fetchData={fetchData}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  )
}

export default TableList
