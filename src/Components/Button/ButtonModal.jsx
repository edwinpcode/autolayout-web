import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  axiosPost,
  getCancelModal,
  getViewDoc,
} from "../../Services/AutoLayoutService"
import { getFieldByGrid } from "../../Services/StructureService"
import ModalWithButton from "../Modal/ModalWithButton"

function ButtonModal({
  dataTarget,
  label,
  gridItem,
  icon,
  buttonItem,
  setFilterData,
  setDataQuery,
  info,
  index,
  pageIndex,
  pageSize,
  fetchData,
  setAutoOpenFirstItem,
  ...props
}) {
  // state
  const [data, setData] = useState()
  const [listField, setListField] = useState([])
  const [actionList, setActionList] = useState([])
  const [loading, setLoading] = useState(true)

  // redux state
  const menu = useSelector((state) => state.menu)
  const userId = useSelector((state) => state.user.id)

  const handleButtonClick = async (item) => {
    if (item.contents?.data?.length >= 1) {
      setLoading(false)
      setData(item.contents)
      setActionList(item.contents.action)
      return
    }

    // cancel modal
    if (item.flagType === "cancel") {
      // window.$('.modal').modal('hide')
      const payload = {
        cancelId: item.actionId,
        param: [],
      }
      item.url.param.forEach((paramId) => {
        const paramValue = document.getElementById(paramId).value
        payload.param.push({ id: paramId, value: paramValue })
      })
      await getCancelModal(payload).then((res) => {
        setListField(res.data.data.listField)
        setData(res.data.data)
        setActionList(res.data.data.action)
        setLoading(false)
      })
    }

    // button proses modal
    if (item.flagAction === "detailMenuFasilitas") {
      const payload = {
        gridID: gridItem?.id || buttonItem?.id,
        flag: item.flagAction,
        param: [],
      }
      // handle param
      item.url.param.forEach((paramId) => {
        const paramValue = info.row.original[paramId]
        payload.param.push({ id: paramId, value: paramValue })
      })
      // get menu fasilitas
      await axiosPost("/listtabproduct", payload).then((res) => {
        if (res.data.status != "1") {
          return window.Swal.fire("", res.data.message, "error")
        }
        setData(res.data.data)
        setLoading(false)
      })
      return
    }

    // view modal
    if (["View", "Lihat"].includes(item.label)) {
      const payload = {
        param: [],
      }
      // handle param
      item.url.param.forEach((paramId) => {
        const paramFieldValue = window.$("#" + paramId).val()
        if (paramFieldValue) {
          payload.param.push({ id: paramId, value: paramFieldValue })
        } else {
          const paramRowValue = info.row.original[paramId]
          payload.param.push({ id: paramId, value: paramRowValue })
        }
      })
      await getViewDoc(payload).then((res) => {
        if (res.data.status != "1") {
          return window.Swal.fire("Error", res.data.message, "error")
        }
        setData(res.data)
        setLoading(false)
      })
      return
    }

    // cancel modal
    // if (item.flag === '2' || item.flag === '3') {
    //   const payload = {
    //     cancelId: item.actionId,
    //     param: [],
    //   }
    //   item.url.param.forEach((paramId) => {
    //     const paramValue = document.getElementById(paramId).value
    //     payload.param.push({ id: paramId, value: paramValue })
    //   })
    //   await getCancelModal(payload).then((res) => {
    //     setData(res.data.data.listField)
    //     setActionList(res.data.data.action)
    //     setModalCancel(res.data)
    //   })
    //   return
    // }

    if (item.flagType === "detail") {
      const payload = {
        gridId: gridItem?.id || buttonItem?.id,
        isNew: item.isNew == "1" ? "1" : "0",
        tc: menu.activeTrackId,
        userId: userId,
        param: [],
      }
      if (item.buttonId) {
        Object.assign(payload, { buttonId: item.buttonId })
      }
      // set param by paramId
      item.url.param.forEach((paramId) => {
        const paramFieldValue = window.$("#" + paramId).val()
        if (paramFieldValue !== undefined) {
          payload.param.push({ id: paramId, value: paramFieldValue })
        } else {
          const paramRowValue = info.row.original[paramId]
          payload.param.push({ id: paramId, value: paramRowValue })
        }
      })
      await getFieldByGrid(payload).then((res) => {
        if (res.data.status != "1") {
          setLoading(false)
          return window.Swal.fire("", res.data.message, "error")
        }
        setData(res.data)
        setActionList(res.data.action)
        setLoading(false)
      })
    }
  }

  useEffect(() => {
    window.$("#" + dataTarget).on("hide.bs.modal", function () {
      setData(null)
      setActionList([])
      setLoading(true)
      // window.$('.modal').modal('hide')
      // window.$('#' + dataTarget).off('hide.bs.modal')
    })
  }, [])

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  return (
    <>
      <button
        type="button"
        data-toggle="modal"
        data-target={"#" + dataTarget + "_" + buttonItem.id}
        onClick={() => handleButtonClick(buttonItem)}
        {...props}
      >
        <i className={icon}></i>
        <span>{label}.</span>
      </button>
      <ModalWithButton
        data={data}
        listField={listField}
        dataTarget={dataTarget}
        actionList={actionList}
        setFilterData={setFilterData}
        buttonItem={buttonItem}
        gridItem={gridItem}
        setDataQuery={setDataQuery}
        loading={loading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        fetchData={fetchData}
        setAutoOpenFirstItem={setAutoOpenFirstItem}
      />
    </>
  )
}

export default ButtonModal
