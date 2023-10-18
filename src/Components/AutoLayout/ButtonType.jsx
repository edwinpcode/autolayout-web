import ButtonAction from '../Button/ButtonAction'
import ButtonModal from '../Button/ButtonModal'
import ButtonOpenPanel from '../Button/ButtonOpenPanel'
import ButtonDropdownTopAction from '../Table/TopAction/ButtonDropdownTopAction'

function ButtonType({
  buttonItem,
  gridItem,
  setDataQuery,
  setStructures,
  setFilterData,
  handleSubmit,
  panelList,
  saveEndpoint,
  getValues,
  setValue,
  info,
  index,
  resetTab,
  pageSize = 10,
  pageIndex = 0,
  fetchData = () => {},
}) {
  return (
    <>
      {['button', 'anchor', 'linkmaps'].includes(buttonItem.type) && (
        <ButtonAction
          resetTab={resetTab}
          type="button"
          getValues={getValues}
          setValue={setValue}
          actionItem={buttonItem}
          handleSubmit={handleSubmit}
          panelList={panelList}
          gridItem={gridItem}
          setStructures={setStructures}
          setDataQuery={setDataQuery}
          saveEndpoint={saveEndpoint}
          setFilterData={setFilterData}
          info={info}
          pageIndex={pageIndex}
          pageSize={pageSize}
          fetchData={fetchData}
        />
      )}
      {buttonItem.type === 'buttonDropdown' && (
        <ButtonDropdownTopAction
          icon={buttonItem.icon}
          label={buttonItem.label}
          item={buttonItem.item}
          className={buttonItem.className + ' dropdown-toggle'}
        />
      )}
      {buttonItem.type === 'buttonModal' && (
        <ButtonModal
          icon={buttonItem.icon}
          label={buttonItem.label}
          dataTarget={
            index ? buttonItem.dataTarget + index : buttonItem.dataTarget
          }
          className={buttonItem.className + ' mx-2'}
          gridItem={gridItem}
          setDataQuery={setDataQuery}
          setFilterData={setFilterData}
          buttonItem={buttonItem}
          info={info}
          index={index}
          pageIndex={pageIndex}
          pageSize={pageSize}
          fetchData={fetchData}
        />
      )}
      {buttonItem.type === 'buttonOpenPanel' && (
        <ButtonOpenPanel
          headerItem={buttonItem}
          info={info}
          getValues={getValues}
        />
      )}
    </>
  )
}

export default ButtonType
