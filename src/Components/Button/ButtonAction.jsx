import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import {
  axiosPost,
  dataExport,
  deleteData,
  getField,
  saveDataAndUpload,
  saveForm,
  updateStatus,
} from "../../Services/AutoLayoutService"
import Load from "../../Pages/FullLoad"
import {
  handleGetGridData,
  handleGetGridStructure,
  handleGetListData,
} from "../../Utils/TableUtils"
import { confirmSwal } from "../../Utils/SwalUtils"
import CryptoJS from "crypto-js"
import {
  setFilteringList,
  setGridFilter,
  triggerRefreshGrid,
} from "../../Store/List/listSlice"
import { handleParamValues } from "../../Utils/ParamUtils"
import { getFieldByFieldId } from "../../Utils/FieldReferenceUtils"
import { setFormAction, setFormPanel } from "../../Store/Form/FormSlice"
import { setLoadingField } from "../../Store/Loading/LoadingSlice"
import { setInboxParam } from "../../Store/Inbox/InboxStore"
import { setTab } from "../../Store/tabSlice"
import axios from "axios"

const openInNewTab = (url) => {
  window.open(url, "_blank", "noreferrer")
}
const openMaps = (longlat) => {
  if (longlat === "") {
    window.Swal.fire(
      "Gagal",
      "Gagal Membuka Maps, Pastika Longitude dan Latitude sudah benar",
      "error",
    )
    return
  }
  window.open(
    "https://www.google.com/maps/search/?api=1&query=" + longlat,
    "_blank",
    "noreferrer",
  )
}

function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data)
  const byteArrays = []
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }
  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

function ButtonAction({
  actionItem,
  handleSubmit,
  panelList,
  gridItem,
  getValues,
  setValue,
  saveEndpoint,
  setDataQuery,
  setStructures,
  setFilterData,
  info,
  resetTab = () => {},
  pageIndex,
  pageSize,
  fetchData = () => {},
  selected = [],
  // setTab = (value) => {},
  setAutoOpenFirstItem,
  ...props
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  // loading
  const [loader, showLoader, hideLoader] = Load()
  // redux
  const user = useSelector((state) => state.user)
  const menu = useSelector((state) => state.menu)
  const param = useSelector((state) => state.inbox.param)
  const hiddenField = useSelector((state) => state.hiddenElement.hiddenField)
  const currentListPayload = useSelector((state) => state.list.currentPayload)
  // const lastFormPayload = useSelector((state) => state.form.lastPayload)
  const filtering = useSelector((state) => state.list.filtering)

  // refresh grid data
  const refreshGridData = async ({
    withFiltering = false,
    fieldData = {},
  } = {}) => {
    if (gridItem) {
      const payload = {
        grid: gridItem.id,
        filtering: [],
        param: [],
        pagination: { pageIndex: 1, perPage: 10 },
        tc: menu.activeTrackId,
      }
      if (withFiltering) {
        let filtering = []
        for (const [id, value] of Object.entries(fieldData)) {
          // with id
          payload.filtering.push({ id, value: value || "" })
          // with label
          let { label } = getFieldByFieldId(id, panelList)
          filtering.push({ label, value: value || "" })
        }
        // dispatch dipake nanti ketika filter pagination sudah fix
        dispatch(setGridFilter(payload.filtering))
        setFilterData(filtering)
      }
      gridItem.reference.parent.forEach((parentId) => {
        const parentValue = document.getElementById(parentId).value
        payload.param.push({ id: parentId, value: parentValue })
      })
      await handleGetGridData(payload, setDataQuery)
    }
  }
  // refresh grid structure
  const refreshGridStructure = async () => {
    if (gridItem) handleGetGridStructure(setStructures, gridItem)
  }
  // download file
  const downloadFile = (base64, fileName, fileType) => {
    let mimeType = "application/pdf"
    if (fileType === "docx") {
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
    if (fileType === "excel") {
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
    if (fileType === "csv") {
      mimeType = "text/csv"
    }
    const extensition = fileType === "excel" ? ".xlsx" : `.${fileType}`
    const linkSource = `data:${mimeType};base64,${base64}`
    const downloadLink = document.createElement("a")

    downloadLink.href = linkSource
    downloadLink.download = fileName + extensition
    downloadLink.click()
  }

  const findPanelId = (fieldId) => {
    let panelId = ""
    panelList.forEach((panelItem) => {
      panelItem.listField.forEach((fieldItem) => {
        if (fieldItem.id === fieldId) {
          panelId = panelItem.panelId
        }
      })
    })
    return panelId
  }

  const handleButtonClick = async ({ data, selected }) => {
    // showLoader()
    // available action:
    // redirect, save, submit, cancel
    // console.log(actionItem)
    if (actionItem.url?.param?.length) {
      const param = handleParamValues(actionItem.url.param, getValues, info)
      // dispatch(setParam(param))
      dispatch(setInboxParam(param))
    } else {
      // dispatch(setParam([]))
      dispatch(setInboxParam(param))
    }
    if (pathname == actionItem.url?.path) {
      dispatch(setTab([]))
    }
    if (actionItem.isRedirect === "1") {
      const payload = {}
      if (actionItem.url.param) {
        const param = handleParamValues(actionItem.url.param, getValues, info)
        Object.assign(payload, { param })
        dispatch(setInboxParam(param))
        // console.log("to form")
        return navigate(actionItem?.url?.path, { state: payload })
      }
    }
    if (actionItem.flagType == "multiSubmit") {
      const payload = {
        id: actionItem.param,
        param: selected,
        flagAction: actionItem.flagAction,
      }
    }

    // save
    if (actionItem.flagType === "save") {
      const payload = {
        panel: [],
        userId: user.id,
        tc: menu.activeTrackId,
      }
      // list of not saved field
      let notSavedFields = []
      panelList.forEach((panelItem) => {
        panelItem.listField.forEach((fieldItem) => {
          if (fieldItem.fieldSave === "0") notSavedFields.push(fieldItem.id)
        })
      })
      // notSavedFields.length && console.log("not saved field", notSavedFields)
      // mapping form data to payload
      for (let [fieldId, fieldValue] of Object.entries(data)) {
        // not include in notSavedFields & hiddenField
        const panelId = findPanelId(fieldId)
        // prettier-ignore
        if (!notSavedFields.includes(fieldId) && !hiddenField.includes(fieldId) && fieldValue !== undefined && panelId) {
          payload.panel.push({ fieldId, fieldValue, panelId })
        }
      }
      // set payload param
      if (actionItem.url.param.length) {
        const param = handleParamValues(actionItem.url.param, getValues)
        Object.assign(payload, { param })
      }
      // save data
      await saveForm(saveEndpoint, payload).then((res) => {
        showLoader()
        if (res.data.status != "1") {
          hideLoader()
          return window.Swal.fire("Kesalahan", res.data.message, "error")
        }
        hideLoader()
        window.$(".modal").modal("hide")
        window.Swal.fire("Berhasil", res.data.message, "success")
        refreshGridData()
        if (res?.data?.key?.length) {
          // navigate(`/${menuId}`, { state: { param: res.data.key } })
        }
        if (res?.data?.field?.length) {
          res.data.field.forEach((field) => {
            setValue(field.id, field.value)
          })
        }
      })
      // hardcode (simpan jaminan)
      if (actionItem.flagAction === "saveJaminan") {
        dispatch(triggerRefreshGrid())
      }
    }

    // save
    if (actionItem.flagType === "saveAndUpload") {
      const formData = new FormData()
      // param
      const param = []
      actionItem.url.param.forEach((paramId) => {
        const paramValue = window.$("#" + paramId).val()
        param.push({ id: paramId, value: paramValue })
      })
      formData.append("param", JSON.stringify(param))
      // fields
      const fields = []
      for (const [id, value] of Object.entries(data)) {
        const fieldEl = window.$("#" + id).attr("type")
        if (fieldEl === "file") {
          formData.append("file", data[id][0])
        } else {
          fields.push({ id, value })
        }
      }
      formData.append("fields", JSON.stringify(fields))
      // user id
      formData.append("userid", user.id)
      formData.append("tc", menu.activeTrackId)
      formData.append("uploadtype", actionItem.flagAction)
      formData.append("lat", "hardcode") // hardcode
      formData.append("lon", "hardcode")
      formData.append("addr", "hardcode")
      await saveDataAndUpload(formData).then((res) => {
        if (res.data.status != "1") {
          hideLoader()
          return window.Swal.fire("Error", res.data.message, "error")
        }
        window.$(".modal").modal("hide")
        window.Swal.fire("Berhasil", res.data.message, "success")
      })
      refreshGridData()
      hideLoader()
    }

    // submit & cancel
    if (["submit", "cancel"].includes(actionItem.flagType)) {
      const payload = {
        flagType: actionItem.flagType,
        flagAction: actionItem.flagAction,
        flowId: menu.activeTrackId,
        userId: user.id,
      }
      if (actionItem.url.param.length) {
        const param = handleParamValues(actionItem.url.param, getValues)
        Object.assign(payload, { param })
      }
      // alert('tinggal kirim payload. NOTE : ada code loading juga nanti disini')
      updateStatus(payload).then((res) => {
        if (res.data.status != "1") {
          hideLoader()
          if (res.data.message != "") {
            return window.Swal.fire("Kesalahan", res.data.message, "error")
          }
          return window.Swal.fire("Kesalahan", "Something went wrong", "error")
        }
        window.Swal.fire("Berhasil", res.data.message, "success")
        window.$(".modal").modal("hide")
        hideLoader()
        if (res.data.isBackToInbox === "1") {
          // navigate(`/${menuId}`)
          navigate("/")
        }
        refreshGridData()
      })
    }

    // delete
    if (actionItem?.flagType === "hapus") {
      const payload = {}
      if (actionItem.url.param.length) {
        const param = handleParamValues(actionItem.url.param, getValues, info)
        Object.assign(payload, { param })
      }
      // set flag to paylod
      Object.assign(payload, { flagType: actionItem.flagType })
      Object.assign(payload, { flagAction: actionItem.flagAction })
      // delete action
      await deleteData(payload).then((res) => {
        if (res.data.status != "1") {
          hideLoader()
          return window.Swal.fire("", res.data.message, "error")
        }
        hideLoader()
        window.Swal.fire("", res.data.message, "success")
      })
      // refresh grid data
      refreshGridData()
    }

    //download

    if (actionItem?.flagType == "download") {
      if (actionItem.url?.path) {
        const url = actionItem.url.path
        const link = document.createElement("a")
        link.href = url
        link.target = "_blank"
        link.setAttribute("download", "file.pdf")
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        // axios
        //   .get(actionItem.url.path, {
        //     responseType: "blob",
        //     headers: {
        //       "Access-Control-Allow-Origin": "*",
        //     },
        //   })
        //   .then((response) => {
        //     const url = window.URL.createObjectURL(new Blob([response.data]))
        //     const link = document.createElement("a")
        //     link.href = url
        //     link.target = "_blank"
        //     link.setAttribute("download", "file.pdf")
        //     document.body.appendChild(link)
        //     link.click()
        //     link.parentNode.removeChild(link)
        //   })
        //   .catch((error) => {
        //     console.error("Error downloading file: ", error)
        //   })
      }
    }

    // export
    if (actionItem?.flagType === "export") {
      const fileType = actionItem.flagAction.match(/export(\w+)/)[1]
      const payload = {
        ...currentListPayload,
        fileType: fileType.toLowerCase(),
      }
      await dataExport(payload)
        .then((res) => {
          if (res.data.status != "1") {
            hideLoader()
            return window.Swal.fire("", res.data.message, "error")
          }
          const data = res.data.data
          downloadFile(data.base64, data.fileName, data.fileType)
          window.Swal.fire("", res.data.message, "success")
        })
        .catch((e) => {
          window.Swal.fire("Kesalahan", e.message, "error")
        })
    }

    // upload
    if (actionItem.flagType === "upload") {
      const payload = {}
      // console.log("perlu edit")
    }

    // search / filter
    if (actionItem.flagType === "search") {
      if (gridItem) {
        refreshGridData({ withFiltering: true, fieldData: data })
        window.$(".modal").modal("hide")
      } else {
        const payload = {
          userId: user.id,
          menuId: menu.activeMenuId,
          moduleId: user.activeModule.id,
          roleId: user.activeRole.id,
          filtering: [],
          pagination: {
            pageIndex: 1, // hardcode
            perPage: 10,
          },
        }
        let filtering = []
        // console.log("data: ", data)
        for (const [id, value] of Object.entries(data)) {
          // with id
          payload.filtering.push({ id, value: value || "" })
          // with label
          let { label } = getFieldByFieldId(id, panelList)
          filtering.push({ label, value: value || "" })
        }
        // console.log(filtering)
        // dispatch dipake nanti ketika filter pagination sudah fix
        dispatch(setFilteringList(payload.filtering))
        setFilterData(filtering)
        // hideLoader() ga jalan?
        handleGetListData({ payload, setDataQuery, setAutoOpenFirstItem })
        window.$(".modal").modal("hide")
      }
      return
    }

    // use / pakai
    if (actionItem.flagType === "use") {
      const payload = {
        flagType: actionItem.flagType,
        flagAction: actionItem.flagAction,
      }
      if (actionItem.url.param.length) {
        const param = handleParamValues(actionItem.url.param, getValues, info)
        Object.assign(payload, { param })
      }
      await axiosPost("/usedata", payload).then((res) => {
        if (res.data.status !== "1") {
          hideLoader()
          return window.Swal.fire("Error", res.data.message, "error")
        }
        window.Swal.fire("", res.data.message, "success")
      })
      refreshGridData()
    }

    // generate
    if (actionItem.flagType === "generate") {
      const payload = {
        flagType: actionItem.flagType,
        flagAction: actionItem.flagAction,
      }
      if (actionItem.url.param.length) {
        const param = handleParamValues(actionItem.url.param, getValues, info)
        Object.assign(payload, { param })
      }
      await axiosPost("/generatedocument", payload).then((res) => {
        if (res.data.status !== "1") {
          hideLoader()
          return window.Swal.fire("Error", res.data.message, "error")
        }
        window.Swal.fire("", res.data.message, "success")
      })
      refreshGridStructure()
      refreshGridData()
    }

    // preview
    if (actionItem.flagType === "preview") {
      const payload = {
        flagType: actionItem.flagType,
        flagAction: actionItem.flagAction,
        param: handleParamValues(actionItem.url.param, getValues, info),
      }
      const data = await axiosPost("/viewdocument", payload).then((res) => {
        if (res.data.status !== "1") {
          hideLoader()
          return window.Swal.fire("Error", res.data.message, "error")
        }
        return res.data.data
      })
      if (data.fileType === "docx") {
        downloadFile(data.base64, data.fileName, data.fileType)
      } else {
        const blob = b64toBlob(data.base64, "application/pdf")
        const blobUrl = URL.createObjectURL(blob)
        // const uniqueCode = blobUrl.substring(blobUrl.lastIndexOf('/') + 1)
        window.open(`/preview?src=${blobUrl}`, "_blank")
      }
    }

    // home
    if (actionItem.flagType === "home") {
      dispatch(setLoadingField(true))
      dispatch(setGridFilter([]))
      dispatch(setFilteringList([]))
      dispatch(setFormPanel([]))
      dispatch(setFormAction([]))
      const payload = {
        tabId: menu.activeTabId,
        tc: menu.activeTrackId,
        userId: user.id,
        param: [{ id: param[0]?.id || "", value: param[0]?.value || "" }],
      }
      // get field by payload
      await getField(payload).then((res) => {
        if (res.data.status != "1") {
          hideLoader()
          return window.Swal.fire("Kesalahan", res.data.message, "error")
        }
        dispatch(setFormPanel(res.data.panel))
        dispatch(setFormAction(res.data.action))
        dispatch(setLoadingField(false))
      })
    }

    // change
    if (actionItem.flagType === "change") {
      const hashedPassword = CryptoJS.TripleDES.encrypt(
        "plos1234",
        "Monday-2023-04-10-11",
      )
      const decryptPass = CryptoJS.TripleDES.decrypt(
        hashedPassword,
        "Monday-2023-04-10-11",
      )
      console.log(hashedPassword)
      console.log(decryptPass)
      // const payload = {
      //   type: actionItem.flagType,
      //   userid: user.id,
      //   password: data.oldPassword,
      //   newpwd: data.newPassword,
      //   repassword: data.confirmNewPassword,
      // }
      // await axiosPost('/changepassword', payload).then((res) => {
      //   if (res.data.status !== '1') {
      //     hideLoader()
      //     return window.Swal.fire('', res.data.message, 'error')
      //   }
      //   window.Swal.fire('Berhasil', res.data.message, 'success')
      // })
    }
    fetchData(menu.activeMenuId, pageIndex, pageSize, filtering)
    resetTab()
    hideLoader()
  }

  const confirmButtonClick = (data, alert) => {
    // handle need confirm
    // console.log(data, actionItem)
    if (actionItem?.needConfirm === "1") {
      confirmSwal({
        action: handleButtonClick,
        data: data,
        label: actionItem?.label,
        alert: alert,
        selected: selected,
      })
    } else {
      handleButtonClick({ data, selected })
    }
  }

  return (
    <>
      {actionItem.type === "button" && actionItem.path && (
        <a
          className={actionItem.className}
          onClick={
            handleSubmit
              ? handleSubmit((data) =>
                  confirmButtonClick(data, actionItem.alert),
                )
              : confirmButtonClick
          }
          {...props}
          href={actionItem.path}
        >
          <i className={actionItem.icon}></i>
          {actionItem.label}
        </a>
      )}
      {actionItem.type === "button" && (
        <button
          className={actionItem.className}
          onClick={
            handleSubmit
              ? handleSubmit((data) =>
                  confirmButtonClick(data, actionItem.alert),
                )
              : confirmButtonClick
          }
          {...props}
        >
          <i className={actionItem.icon}></i>
          {actionItem.label}
        </button>
      )}
      {actionItem.type === "anchor" && (
        <div className="mx-auto">
          <button
            type="button"
            onClick={confirmButtonClick}
            className="btn btn-xs btn-link"
          >
            {actionItem.label}
          </button>
        </div>
      )}
      {actionItem.type === "linkmaps" && (
        <>
          <label onClick={() => console.log(actionItem)}>
            {actionItem.label}{" "}
            {actionItem.isMandatory === "1" && (
              <span className="text-danger font-weight-bold"> *</span>
            )}
          </label>
          <button
            type="button"
            onClick={() =>
              openMaps(
                document.querySelector("#" + actionItem.reference.parent[0])
                  .value,
              )
            }
            className="btn btn-xs btn-success form-control"
          >
            Buka Maps
          </button>
        </>
      )}
      {loader}
    </>
  )
}

export default ButtonAction
