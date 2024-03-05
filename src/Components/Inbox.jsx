import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { handleStructureHeader } from "../Utils/TableUtils"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import classNames from "classnames"
import FullLoad from "../Pages/FullLoad"
import TopAction from "./Table/TopAction"
import { getFieldByFieldId } from "Utils/FieldReferenceUtils"
import TableComponent from "./Table/TableComponent"

const Inbox = ({
  getValues,
  gridItem,
  pageIndex,
  pageSize,
  setPagination,
  fetchData,
  dataQuery,
  setDataQuery,
  structures,
  setStructures,
  className,
  loading,
  // setTab,
}) => {
  const columnHelper = createColumnHelper()
  const [filterData, setFilterData] = useState([])
  const menu = useSelector((state) => state.menu)
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const { param } = useSelector((state) => state.inbox)
  const filter = useSelector((state) => state.list.filtering)
  const [type, setType] = useState("inbox")

  // useEffect(() => {
  //   setFilterData([])
  // }, [menu.activeMenuId])

  useEffect(() => {
    if (filter.length && structures?.topAction?.length) {
      const topAction = structures?.topAction?.find(
        (item) => item.dataTarget == "filterModal",
      )
      let filtering = []
      let panelList = [{ listField: topAction.contents }]
      for (let i = 0; i < filter.length; i++) {
        // for (const [id, value] of Object.entries(filter[i])) {
        //   console.log(id, value, filter[i])
        //   let res = getFieldByFieldId(id, panelList)
        // }
        // console.log(filter[i].id)
        let res = getFieldByFieldId(filter[i].id, panelList)
        if (res && res.label && res.label != "") {
          filtering.push({ label: res.label, value: filter[i].value || "" })
        }
      }
      setFilterData(filtering)
    } else if (!filter.length) {
      setFilterData([])
    }
  }, [filter, structures])

  useEffect(() => {
    console.log(filterData)
  }, [filterData])

  const columnVisibility = useMemo(
    () => structures.headerVisibility,
    [structures],
  )

  const columns = useMemo(() => {
    return handleStructureHeader({
      structures,
      columnHelper,
      setDataQuery,
      fetchData,
      pageIndex,
      pageSize,
      setSelected,
      // setTab,
    })
  }, [structures])

  const filterDataLabel = useMemo(() => {
    const searchCriteria = []
    if (filterData) {
      filterData.forEach(({ label, value }) => {
        if (value !== "") searchCriteria.push(`${label} = ${value}`)
      })
      const res = searchCriteria.join(", ")
      return res
    }
    return filterData
  }, [filterData])

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  useEffect(() => {
    setSelected([])
  }, [dataQuery])

  // useEffect(() => {
  //   console.log(dataQuery)
  // }, [dataQuery])

  const table = useReactTable({
    data: dataQuery?.rows ?? [],
    columns: columns ?? [],
    pageCount: dataQuery?.pageCount ?? -1,
    state: {
      columnVisibility,
      pagination,
      rowSelection,
    },
    // onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: false,
  })

  // useEffect(() => {
  //   if (id && value) {
  //     setOpen(false)
  //   } else {
  //     setOpen(true)
  //   }
  // }, [id, value])

  // useEffect(() => {
  //   document.getElementById("body").classList.add("sidebar-collapse")
  //   if (!open) {
  //     document.getElementById("inboxCard").classList.add("collapsed-card")
  //     document
  //       .getElementById("collapseButton")
  //       .classList.replace("fa-minus", "fa-plus")
  //     document.getElementById("inboxBody").classList.add("d-none")
  //   } else {
  //     document.getElementById("inboxCard").classList.remove("collapsed-card")
  //     document
  //       .getElementById("collapseButton")
  //       .classList.replace("fa-plus", "fa-minus")
  //     document.getElementById("inboxBody").classList.remove("d-none")
  //   }
  // }, [open])

  const onFullscreen = () => {
    if (type == "inbox") {
      setType("table")
    }
    if (type == "table") {
      setType("inbox")
    }
  }

  // useEffect(() => {
  //   console.log(type)
  // }, [type])

  return (
    <div className={`${className} col-md-3`}>
      <div className="card card-success" id="inboxCard">
        <div className="card-header">
          <span className="card-title">{menu.activeMenuDesc}</span>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              onClick={() => onFullscreen()}
              data-card-widget="maximize"
            >
              <i className="fas fa-expand"></i>
            </button>
            <button
              className="btn btn-tool"
              onClick={() => setOpen((state) => !state)}
              data-card-widget="collapse"
            >
              <i className="fas fa-minus" id="collapseButton"></i>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="card-body" id="inboxBody">
            <div>Loading...</div>
          </div>
        ) : (
          <div className="card-body" id="inboxBody">
            {type == "inbox" ? (
              <div>
                <div>
                  {structures?.topAction?.length > 0 && (
                    <TopAction
                      structures={structures}
                      setStructures={setStructures}
                      setDataQuery={setDataQuery}
                      gridItem={gridItem}
                      getValues={getValues}
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      fetchData={fetchData}
                      setFilterData={setFilterData}
                      filterData={filterData}
                      filterDataLabel={filterDataLabel}
                      selected={selected}
                      // setTab={setTab}
                    />
                  )}
                </div>
                <div>
                  {dataQuery?.total > 10 && (
                    <section className="">
                      <div
                        className={`d-flex ${
                          type == "inbox" ? "justify-content-between" : ""
                        }`}
                      >
                        <div className="pr-2 text-sm">
                          Halaman {table.getState().pagination.pageIndex + 1}{" "}
                          dari {table.getPageCount()}
                        </div>
                        <select
                          className="form-control form-control-sm"
                          style={{ width: 120 }}
                          value={table.getState().pagination.pageSize}
                          onChange={(e) => {
                            table.setPageSize(Number(e.target.value))
                          }}
                        >
                          {[10, 25, 50, 75, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                              Tampilkan {pageSize}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="d-flex mt-1">
                        <div
                          className={classNames(
                            "page-item ",
                            {
                              disabled: !table.getCanPreviousPage(),
                            },
                            type == "inbox" ? "w-100" : "",
                          )}
                          onClick={() => table.previousPage()}
                        >
                          <button
                            type="button"
                            className={`page-link ${
                              type == "inbox" ? "w-100" : ""
                            }`}
                            tabIndex="-1"
                            aria-disabled="true"
                          >
                            Sebelumnya
                          </button>
                        </div>
                        <div
                          className={classNames(
                            "page-item ",
                            {
                              disabled: !table.getCanNextPage(),
                            },
                            type == "inbox" ? "w-100" : "",
                          )}
                          onClick={() => table.nextPage()}
                        >
                          <button
                            type="button"
                            className={`page-link ${
                              type == "inbox" ? "w-100" : ""
                            }`}
                          >
                            Selanjutnya
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
                <div
                  className="mt-3"
                  style={{
                    height: filterDataLabel ? "50vh" : "60vh",
                  }}
                >
                  <div className="overflow-auto h-100">
                    {table.getRowModel().rows.length <= 0 && (
                      <div>
                        <div
                          colSpan={100}
                          className="text-center text-gray text-sm py-2"
                        >
                          Tidak ada data untuk ditampilkan
                        </div>
                      </div>
                    )}
                    {table.getRowModel().rows.map((row, index) => {
                      let id = "0"
                      let value = "0"
                      if (param.length) {
                        id = param[0].id
                        value = param[0].value
                      }
                      return (
                        <div
                          key={index}
                          className={`border ${
                            row.original[id] == value ? "bg-light" : ""
                          }`}
                        >
                          {row.getVisibleCells().map((cell, index) => {
                            let right = false
                            if (cell.getContext().cell.id.includes("action")) {
                              right = true
                            }
                            return (
                              <div
                                key={index}
                                className={`flex-fill d-flex ${
                                  right
                                    ? "justify-content-end"
                                    : "justify-content-evenly"
                                } p-1`}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Inbox
