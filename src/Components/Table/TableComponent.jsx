import { useMemo, useState } from "react"
// prettier-ignore
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, } from '@tanstack/react-table'
import classNames from "classnames"
import { handleStructureHeader } from "../../Utils/TableUtils"
import { SkeletonTable } from "../AutoLayout/Skeleton"
import TopAction from "./TopAction"

function TableComponent({
  dataQuery,
  structures,
  pageIndex,
  pageSize,
  gridItem,
  getValues,
  setDataQuery,
  setStructures,
  setPagination,
  fetchData,
}) {
  const columnHelper = createColumnHelper()
  // state
  const [rowSelection, setRowSelection] = useState({})
  const [filterData, setFilterData] = useState([])
  const [selected, setSelected] = useState([])

  const columnVisibility = useMemo(
    () => structures.headerVisibility,
    [structures],
  )

  // handle structure
  const columns = useMemo(() => {
    return handleStructureHeader({
      structures,
      columnHelper,
      gridItem,
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

  // handle pagination
  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  // table option
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

  return (
    <div className="col-12">
      {!dataQuery ? (
        <SkeletonTable />
      ) : (
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
            />
          )}
          <div className="table-responsive">
            <table className="bg-white table table-sm table-striped table-bordered">
              <thead>
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <tr key={headerGroup.id + "_" + index}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          className="text-center"
                          key={header.id}
                          colSpan={header.colSpan}
                          style={
                            header.column.columnDef.header === ""
                              ? { border: "none" }
                              : {}
                          }
                        >
                          {header.isPlaceholder ? null : (
                            <div>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length <= 0 && (
                  <tr>
                    <td
                      colSpan={100}
                      className="text-center text-gray text-sm py-2"
                    >
                      Tidak ada data untuk ditampilkan
                    </td>
                  </tr>
                )}
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell, index) => {
                        return (
                          <td key={index}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {dataQuery.total > 10 && (
            <section className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
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
              <div className="pagination pagination-sm justify-content-end">
                <div
                  className={classNames("page-item", {
                    disabled: !table.getCanPreviousPage(),
                  })}
                  onClick={() => table.previousPage()}
                >
                  <button
                    type="button"
                    className="page-link"
                    tabIndex="-1"
                    aria-disabled="true"
                  >
                    Sebelumnya
                  </button>
                </div>
                <div
                  className={classNames("page-item", {
                    disabled: !table.getCanNextPage(),
                  })}
                  onClick={() => table.nextPage()}
                >
                  <button type="button" className="page-link">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default TableComponent
