import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleGetListData, handleGetListStructure } from '../Utils/TableUtils'
import { setCurrentPayload, setFilteringList } from '../Store/List/listSlice'
import TableComponent from '../Components/Table/TableComponent'
import { useParams } from 'react-router-dom'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { handleStructureHeader } from '../Utils/TableUtils'
import classNames from 'classnames'
import FullLoad from '../Pages/FullLoad'
import TopAction from './Table/TopAction'

const Inbox = ({
  getValues,
  gridItem,
  pageIndex,
  pageSize,
  setPagination,
  fetchData,
  pagination,
  columns,
  dataQuery,
  setDataQuery,
  columnVisibility,
  rowSelection,
  setRowSelection,
  structures,
  setStructures,
}) => {
  const [loader, showLoader, hideLoader] = FullLoad()

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
    <div
      className={`col-md-2`}
      style={{
        height: '80vh',
        // width: '25%',
      }}
    >
      {loader}
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
        />
      )}
      {dataQuery?.total > 10 && (
        <section className="">
          <div className="d-flex justify-content-between">
            <div className="pr-2 text-sm">
              Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
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
              className={classNames('page-item w-100', {
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
              className={classNames('page-item w-100', {
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
          height: '75%',
        }}
      >
        <div className="overflow-auto h-100">
          {table.getRowModel().rows.length <= 0 && (
            <tr>
              <td colSpan={100} className="text-center text-gray text-sm py-2">
                Tidak ada data untuk ditampilkan
              </td>
            </tr>
          )}
          {table.getRowModel().rows.map((row) => {
            return (
              <div key={row.id} className="border p-1">
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <div
                      key={index}
                      className="flex-fill d-flex justify-content-evenly"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
  )
}

export default Inbox
