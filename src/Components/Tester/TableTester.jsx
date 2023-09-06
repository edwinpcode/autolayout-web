import { useState } from 'react'
import TableComponent from '../Table/TableComponent'
import { list } from '../../Data/Table/Data/response'
import { structures } from '../../Data/Table/Structure/response'

function TableTester() {
  // state
  const [dataQuery, setDataQuery] = useState({
    rows: list,
    pageCount: 1,
  })
  const [columnVisibility, setColumnVisibility] = useState({ SDE_002: false })
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  return (
    <>
      <h3>Table Component</h3>
      <TableComponent
        dataQuery={dataQuery}
        structures={structures}
        columnVisibility={columnVisibility}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setDataQuery={setDataQuery}
        setColumnVisibility={setColumnVisibility}
        setPagination={setPagination}
      />
    </>
  )
}

export default TableTester
