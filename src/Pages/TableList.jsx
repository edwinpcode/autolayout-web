import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleGetListData, handleGetListStructure } from "../Utils/TableUtils"
import { setCurrentPayload, setFilteringList } from "../Store/List/listSlice"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import AutoLayout from "./AutoLayout"
import Inbox from "../Components/Inbox"
import FullLoad from "./FullLoad"
import TableComponent from "../Components/Table/TableComponent"
import { setInboxData, setInboxParam } from "../Store/Inbox/InboxStore"

function TableList() {
  const [loader, showLoader, hideLoader] = FullLoad()
  // const { menuId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [structures, setStructures] = useState({})
  const menuSlice = useSelector((res) => res.menu)
  const { pathname } = useLocation()

  const tab = useSelector((state) => state.tab)

  // state
  const [dataQuery, setDataQuery] = useState()
  const [autoOpenFirstItem, setAutoOpenFirstItem] = useState("0")
  const inboxData = useSelector((state) => state.inbox.data)
  const [loading, setLoading] = useState(false)
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const user = useSelector((state) => state.user)
  const filtering = useSelector((state) => state.list.filtering)

  const fetchData = async (menuId, pageIndex, pageSize, filtering) => {
    setLoading(true)
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
      await handleGetListData({ payload, setDataQuery, setAutoOpenFirstItem })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (
      dataQuery?.rows?.length &&
      autoOpenFirstItem == "1" &&
      structures?.header?.length
    )
      for (let i = 0; i < structures.header.length; i++) {
        if (structures.header[i].type == "button") {
          for (let j = 0; j < structures.header[i].item.length; j++) {
            const item = structures.header[i].item[j]
            if (item.isRedirect == "1") {
              const data = dataQuery.rows[0]
              const param = []
              item.url.param.forEach((element) => {
                for (let [id, value] of Object.entries(data)) {
                  if (id == element)
                    param.push({
                      id: element,
                      value: value,
                    })
                }
              })
              dispatch(setInboxParam(param))
              navigate(item.url?.path)
            }
          }
        }
      }
  }, [autoOpenFirstItem, dataQuery, structures])

  useEffect(() => {
    if (dataQuery) {
      dispatch(setInboxData(dataQuery))
    }
  }, [dataQuery])

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
    if (menuSlice.path != "/form") {
      setPagination({ pageIndex: 0, pageSize: 10 })
      handleGetListStructure(user, menuSlice.activeMenuId, setStructures)
    }
  }, [menuSlice, user])

  // get data
  useEffect(() => {
    if (menuSlice.path != "/form")
      fetchData(menuSlice.activeMenuId, pageIndex, pageSize, filtering)
  }, [menuSlice, pageIndex, pageSize, filtering])

  useEffect(() => {}, [])

  return (
    <div>
      <div className="d-md-flex">
        {pathname != "/report" && menuSlice.path == "/" && (
          <Inbox
            // className={"col-md-3"}
            pageIndex={pageIndex}
            pageSize={pageSize}
            fetchData={fetchData}
            setPagination={setPagination}
            dataQuery={inboxData}
            setDataQuery={setDataQuery}
            structures={structures}
            setStructures={setStructures}
            loading={loading}
          />
        )}
        {pathname == "/report" && (
          <TableComponent
            dataQuery={dataQuery}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setDataQuery={setDataQuery}
            setPagination={setPagination}
            fetchData={fetchData}
            structures={structures}
            setStructures={setStructures}
          />
        )}
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
