import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FieldType from './FieldType'
import Panel from './Panel'

function FieldWithPanel({
  panelData,
  activeTabId,
  register,
  unregister,
  setValue,
  getValues,
  handleSubmit,
  clearErrors,
  errors,
  resetField,
  watch,
  control,
  hasAction,
  pageSize = 10,
  pageIndex = 10,
  fetchData = () => {},
  gridItem,
}) {
  const {
    register: registerPanel,
    handleSubmit: handleSubmitPanel,
    formState: { errors: errorsPanel },
    setValue: setValuePanel,
    getValues: getValuesPanel,
    resetField: resetFieldPanel,
    watch: watchPanel,
    clearErrors: clearErrorsPanel,
    control: controlPanel,
    unregister: unregisterPanel,
  } = useForm({ mode: 'onChange' })
  // redux
  const hiddenField = useSelector((state) => state.hiddenElement.hiddenField)

  useEffect(() => {
    hiddenField.forEach((fieldId) => {
      unregister(fieldId)
    })
  }, [hiddenField])

  return (
    <>
      {panelData?.map((panelItem, index) => (
        <Panel
          key={index}
          id={panelItem.panelId}
          name={panelItem.panelName}
          hide={panelItem.hide || false}
          panelAction={panelItem.action || []}
          panelItem={panelItem}
          panelList={panelData}
          getValues={getValuesPanel}
          handleSubmit={handleSubmitPanel}
          pageIndex={pageIndex}
          pageSize={pageSize}
          fetchData={fetchData}
          gridItem={gridItem}
        >
          {panelItem.listField.map((fieldItem) => (
            <React.Fragment key={fieldItem.id}>
              {!hiddenField.includes(fieldItem.id) && (
                <FieldType
                  panel={panelData}
                  fieldItem={fieldItem}
                  fieldList={panelItem.listField}
                  register={panelItem.action ? registerPanel : register}
                  setValue={panelItem.action ? setValuePanel : setValue}
                  getValues={panelItem.action ? getValuesPanel : getValues}
                  clearErrors={
                    panelItem.action ? clearErrorsPanel : clearErrors
                  }
                  resetField={panelItem.action ? resetFieldPanel : resetField}
                  errors={panelItem.action ? errorsPanel : errors}
                  activeTabId={activeTabId}
                  watch={panelItem.action ? watchPanel : watch}
                  control={panelItem.action ? controlPanel : control}
                  unregister={panelItem.action ? unregisterPanel : unregister}
                  gridItem={gridItem}
                />
              )}
            </React.Fragment>
          ))}
        </Panel>
      ))}
    </>
  )
}

export default FieldWithPanel
