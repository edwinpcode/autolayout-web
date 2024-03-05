import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FullLoad from "./FullLoad"
import TableComponent from "Components/Table/TableComponent"
import { setCurrentPayload, setFilteringList } from "Store/List/listSlice"
import {
  setInboxData,
  setInboxFilter,
  setInboxParam,
} from "Store/Inbox/InboxStore"
import { handleGetListData, handleGetListStructure } from "Utils/TableUtils"
import { useLocation, useNavigate } from "react-router-dom"

const DataTablePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [loader, showLoader, hideLoader] = FullLoad()
  const [structures, setStructures] = useState({})
  const menu = useSelector((res) => res.menu)
  const [dataQuery, setDataQuery] = useState()
  const inboxData = useSelector((state) => state.inbox.data)
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const user = useSelector((state) => state.user)
  const filtering = useSelector((state) => state.list.filtering)
  const [autoOpenFirstItem, setAutoOpenFirstItem] = useState("0")

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
      await handleGetListData({ payload, setDataQuery, setAutoOpenFirstItem })
    } catch (error) {
    } finally {
      hideLoader()
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

  // useEffect(() => {
  //   return () => {
  //     dispatch(setFilteringList([])) // reset filter when the component unmounts
  //   }
  // }, [dispatch])

  // get structure
  useEffect(() => {
    if (menu) {
      setPagination({ pageIndex: 0, pageSize: 10 })
      handleGetListStructure(user, menu.activeMenuId, setStructures)
    }
  }, [menu, user])

  // get data
  useEffect(() => {
    if (menu) fetchData(menu.activeMenuId, pageIndex, pageSize, filtering)
  }, [menu, pageIndex, pageSize, filtering])

  return (
    <div>
      <div>
        <span className="text-lg text-bold">{menu.activeMenuDesc}</span>
      </div>
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
    </div>
  )
}

export default DataTablePage
