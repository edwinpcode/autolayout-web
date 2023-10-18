import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FieldType from '../Components/AutoLayout/FieldType'
import Panel from '../Components/AutoLayout/Panel'
import ExportDocxTester from '../Components/Tester/ExportDocxTester'
import FieldConditionTester from '../Components/Tester/FieldConditionTester'
import FieldTester from '../Components/Tester/FieldTester'
import SocketTester from '../Components/Tester/SocketTester'
import TableTester from '../Components/Tester/TableTester'
// import { condition } from '../Data/Field/condition'
import { panelCondition } from '../Data/Panel/condition'
import socket from '../Utils/SocketUtils'
// import { listField } from '../Data/Field/response'

function Tester({
  defaultValue = 10000,
  rule = 'numericAbsolute',
  hide = false,
  pageIndex,
  pageSize,
  fetchData,
}) {
  const {
    handleSubmit,
    register,
    unregister,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    watch,
    resetField,
  } = useForm()
  const [show, setShow] = useState(true)
  // redux
  const hiddenField = useSelector((state) => state.hiddenElement.hiddenField)

  const unregisterField = () => {
    setShow(false)
    unregister('coba')
  }

  const onSubmit = (data) => {
    console.log('ini data', data)
  }

  return (
    <div className="container">
      <hr />
      {/* <FieldConditionTester /> */}
      <hr />
      <h3>Field Tester</h3>
      {/* <FieldTester /> */}
      <hr />
      {/* <TableTester /> */}
      <hr />
      {/* <ExportDocxTester /> */}
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        {panelCondition.panel.map((panelItem, index) => (
          <Panel
            key={index}
            id={panelItem.panelId}
            name={panelItem.panelName}
            hide={panelItem.hide || false}
            panelAction={panelItem.action || []}
            panelList={panelCondition.panel}
            getValues={getValues}
            pageIndex={pageIndex}
            pageSize={pageSize}
            fetchData={fetchData}
          >
            <>
              {panelItem.listField.map((fieldItem) => (
                <React.Fragment key={fieldItem.id}>
                  {!hiddenField.includes(fieldItem.id) && (
                    <FieldType
                      panel={panelCondition.panel}
                      fieldItem={fieldItem}
                      fieldList={panelItem.listField}
                      register={register}
                      setValue={setValue}
                      getValues={getValues}
                      clearErrors={clearErrors}
                      resetField={resetField}
                      errors={errors}
                      watch={watch}
                      unregister={unregister}
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      fetchData={fetchData}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          </Panel>
        ))}
        <button type="submit">submit</button>
      </form>
      <hr />
      {/* <SocketTester socket={socket} /> */}
      {/* <button
        type="button"
        onClick={() => {
          // socket.emit('getDashboard', 'berubah')
        }}
      >
        save
      </button> */}
      <hr />
    </div>
  )
}

export default Tester
