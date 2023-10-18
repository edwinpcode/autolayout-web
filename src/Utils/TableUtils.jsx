import React from 'react'
import ActionItemButton from '../Components/Table/ActionItem/ActionItemButton'
import IndeterminateCheckbox from '../Components/Table/IndeterminateCheckbox'
import ButtonModal from '../Components/Button/ButtonModal'
import { getGridData, getListData } from '../Services/ListService'
import { getAllStructure, getGridStructure } from '../Services/StructureService'
import { dateDisplay, datetimeDisplay, timeDisplay } from './DatetimeUtils'
import ButtonOpenPanel from '../Components/Button/ButtonOpenPanel'
import ButtonType from '../Components/AutoLayout/ButtonType'
import InputCheckbox from '../Components/AutoLayout/Input/InputCheckbox'
import { handleParamValues } from './ParamUtils'

export const addRowSelectionColumn = (defaultColumn, columnHelper) => {
  defaultColumn.unshift(
    columnHelper.accessor('row_selection', {
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
    })
  )
}

let values = []
export const handleColumnType = ({
  info,
  header,
  item,
  setDataQuery,
  fetchData,
  pageIndex,
  pageSize,
}) => {
  // hardcode
  const setActionSelectValue = (selectValue) => {
    const dataIsExist = values.filter(
      (value) => value.data === info.row.original.ap_regno
    )

    if (values.length <= 0 || !dataIsExist.length)
      values.push({
        data: info.row.original.ap_regno,
        actionBulk: selectValue,
      })
    else dataIsExist.map((value) => (value.actionBulk = selectValue))
    return (window.values = values)
  }
  // Text
  if (header.type === 'text') {
    return info.getValue()
  }
  // Checkbox
  if (header.type === 'checkbox') {
    return (
      <InputCheckbox
        info={info}
        param={header.param || []}
        flag={header.flag}
      />
    )
  }
  // Currency
  if (header.type === 'currency') {
    const value = info.getValue()
    return value ? parseFloat(value).toLocaleString('en-US') : ''
  }
  // Datetime
  if (header.type === 'datetime') {
    const value = info.getValue()
    const result = datetimeDisplay(value)
    return result
  }
  // Date
  if (header.type === 'date') {
    const value = info.getValue()
    const result = dateDisplay(value)
    return result
  }
  // Date
  if (header.type === 'time') {
    const value = info.getValue()
    const result = timeDisplay(value)
    return result
  }
  // BUTTON
  if (header.type === 'button') {
    const gridItem = item
    const buttonList = info.getValue()
    if (buttonList === undefined) {
      return (
        <div className="d-flex align-items-center justify-content-center">
          {header.item.map((headerItem, key) => (
            <ButtonType
              buttonItem={headerItem}
              gridItem={gridItem}
              setDataQuery={setDataQuery}
              info={info}
              index={info.row.index}
              key={key}
              fetchData={fetchData}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          ))}
        </div>
      )
    } else {
      return (
        <div className="d-flex align-items-center justify-content-center">
          {header.item.map(
            (headerItem, key) =>
              buttonList.includes(headerItem.label) && (
                <ButtonType
                  buttonItem={headerItem}
                  gridItem={gridItem}
                  setDataQuery={setDataQuery}
                  info={info}
                  index={info.row.index}
                  key={key}
                  fetchData={fetchData}
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                />
              )
          )}
        </div>
      )
    }
  }
  // SELECT
  if (header.type === 'select') {
    return (
      <select
        onChange={(e) => setActionSelectValue(e.target.value)}
        className="custom-select custom-select-sm"
        style={{ width: 100, fontSize: 12 }}
      >
        <option>Pilih action</option>
        {header.item.map((item) => (
          <option key={item.label} value={item.label}>
            {item.label}
          </option>
        ))}
      </select>
    )
  }
  // RADIO
  if (header.type === 'radio') {
    return header.item.map((item) => (
      <div key={item.label} className="position-relative">
        <input
          name={'radio_' + info.row.index}
          className="d-block mx-auto"
          type="radio"
          value={item.label}
        />
      </div>
    ))
  }
}

export const handleStructureHeader = ({
  structures,
  columnHelper,
  item,
  setDataQuery,
  fetchData,
  pageIndex,
  pageSize,
}) => {
  if (!structures.header) return []
  // for (let i = 0; i < structures.header.length; i++) {
  //   console.log(structures.header[i])
  // }
  const defaultColumn = structures.header.map((header, index) =>
    columnHelper.accessor(header.accessor, {
      header: header.label,
      cell: (info) =>
        handleColumnType({
          info,
          header,
          item,
          setDataQuery,
          fetchData,
          pageSize,
          pageIndex,
        }),
      type: header.type,
    })
  )
  if (structures.canSelectAll) {
    // add row selection to first column (array unshift)
    addRowSelectionColumn(defaultColumn, columnHelper)
  }
  // return final column
  return defaultColumn
}

export const handleGetListData = (payload, setDataQuery) => {
  getListData(payload).then((res) => {
    if (res.data.status != '1') {
      // return window.Swal.fire('Kesalahan', res.data.message, 'error')
      setDataQuery({
        rows: [],
        pageCount: 1,
      })
      return
    }
    setDataQuery({
      rows: res.data.data.list,
      pageCount: Math.ceil(
        parseInt(res.data.data.total) / payload.pagination.perPage
      ),
      total: parseInt(res.data.data.total),
    })
  })
}

export const handleGetListStructure = (user, menuId, setStructures) => {
  const payload = {
    userId: user.id,
    menuId: menuId,
    moduleId: user.activeModule.id,
    roleId: user.activeRole.id,
  }
  getAllStructure(payload)
    .then((res) => {
      if (res.data.status != '1') {
        return window.Swal.fire('Kesalahan', res.data.message, 'error')
      }
      setStructures(res.data.data)
    })
    .catch((e) => {
      window.Swal.fire('Kesalahan', e.response.message, 'error')
    })
}

export const handleGetGridData = async (payload, setDataQuery) => {
  await getGridData(payload).then((res) => {
    if (res.data.status != '1') {
      return window.Swal.fire('Kesalahan', res.data.message, 'error')
    }
    setDataQuery({
      rows: res.data.data.list,
      pageCount: Math.ceil(
        parseInt(res.data.data.total) / payload.pagination.perPage
      ),
      total: parseInt(res.data.data.total),
    })
  })
}

export const handleGetGridStructure = (setStructures, gridItem, getValues) => {
  const payload = {
    grid: gridItem.id,
    param: handleParamValues(gridItem.reference.parent, getValues),
  }
  getGridStructure(payload).then((res) => {
    if (res.data.status != '1') {
      return window.Swal.fire('Kesalahan', res.data.message, 'error')
    }
    setStructures(res.data.data)
  })
}
