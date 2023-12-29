import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  handleGetListData,
  handleGetListStructure,
  handleStructureHeader,
} from "../Utils/TableUtils"
import { setCurrentPayload, setFilteringList } from "../Store/List/listSlice"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import classNames from "classnames"
import FullLoad from "../Pages/FullLoad"
import TopAction from "./Table/TopAction"

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
}) => {
  const columnHelper = createColumnHelper()
  const [loader, showLoader, hideLoader] = FullLoad()
  const [filterData, setFilterData] = useState([])
  const menu = useSelector((state) => state.menu)
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState([])
  const [rowSelection, setRowSelection] = useState({})

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

  return (
    <div className={`${className} col-md-3`}>
      <div className="card card-success" id="inboxCard">
        <div className="card-header">
          <span className="card-title">{menu.activeMenuDesc}</span>
          <div className="card-tools">
            <button
              className="btn btn-tool"
              onClick={() => setOpen((state) => !state)}
              // data-card-widget="collapse"
            >
              <i className="fas fa-minus" id="collapseButton"></i>
            </button>
          </div>
        </div>
        <div className="card-body" id="inboxBody">
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
            />
          )}
          {dataQuery?.total > 10 && (
            <section className="">
              <div className="d-flex justify-content-between">
                <div className="pr-2 text-sm">
                  Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
                  {table.getPageCount()}
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
              <div className="d-flex justify-content-between mt-1">
                <div
                  className={classNames("page-item w-100", {
                    disabled: !table.getCanPreviousPage(),
                  })}
                  onClick={() => table.previousPage()}
                >
                  <button
                    type="button"
                    className="page-link w-100"
                    tabIndex="-1"
                    aria-disabled="true"
                  >
                    Sebelumnya
                  </button>
                </div>
                <div
                  className={classNames("page-item w-100", {
                    disabled: !table.getCanNextPage(),
                  })}
                  onClick={() => table.nextPage()}
                >
                  <button type="button" className="page-link w-100">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </section>
          )}
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
                return (
                  <div
                    key={index}
                    // className={`border ${
                    //   id && row.original[id] == value ? 'bg-light' : ''
                    // }`}
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
      </div>
      {loader}
    </div>
  )
}

export default Inbox
