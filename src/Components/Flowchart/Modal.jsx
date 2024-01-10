import React, { useState, useEffect, useRef } from "react"
// import { ErrorMessage } from '@hookform/error-message';
import { useForm } from "react-hook-form"
import InputCommon from "../AutoLayout/Input/InputCommon"
import { useDispatch, useSelector } from "react-redux"
import { setElement } from "../../Store/Flowchart/elementSlice"
import {
  getEdgeDropdown,
  getFlowchartModal,
  getNodeDropdown,
  saveFlowchartModal,
} from "../../Services/FLowchartService"
import { getMenu } from "../../Services/MenuService"
import { useQuery } from "react-query"
import { setNodeId } from "../../Store/Flowchart/nodeSlice"
import {
  setflowchartModalData,
  setflowchartModalId,
} from "../../Store/Flowchart/flowchartModalSlice"

// Modal for edit node or edge on flowchart
function Modal({ code, idParent, parent, panelId }) {
  const nodeState = useSelector((state) => state.node)
  const edgeState = useSelector((state) => state.edge)

  const userId = useSelector((state) => state.user.id)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  const flowchartModalData = useSelector((state) => state.flowchartModal.data)

  const [nodeDropdown, setNodeDropdown] = useState([])
  const [edgeDropdown, setEdgeDropdown] = useState([])
  const [markerDropdown, setMarkerDropdown] = useState([])
  const [orientDropdown, setOrientDropdown] = useState([])
  const [animatedDropdown, setAnimatedDropdown] = useState([])
  const [menuDropdown, setMenuDropdown] = useState([])
  const modalRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [form, setForm] = useState([])
  const [loadingSave, setLoadingSave] = useState(false)

  // const { data } = useQuery(["modal"], () => getFlowchartModal({ code }))

  // useEffect(() => {
  //   console.log(data)
  // }, [data])
  // useEffect(() => setFields(data.data.data), [data])
  // console.log(data)

  const dispatch = useDispatch()

  // set form field
  const { register, reset, getValues, watch, setValue, handleSubmit } = useForm(
    {},
  )

  // get dropdown field value from backend
  useEffect(() => {
    getNodeDropdown().then((res) => {
      setNodeDropdown(res.data.node)
    })
    getEdgeDropdown().then((res) => {
      setEdgeDropdown(res.data.edge)
      setMarkerDropdown(res.data.edgeMarker)
      setOrientDropdown(res.data.edgeMarkerOrient)
      setAnimatedDropdown(res.data.edgeAnimated)
    })
  }, [])

  useEffect(() => {
    if (activeModuleId && activeRoleId)
      getMenu(userId, activeModuleId, activeRoleId).then((res) => {
        if (res.data.status === "1") {
          let data = []
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].child) {
              for (let j = 0; j < res.data.data[i].child.length; j++) {
                data.push(res.data.data[i].child[j])
              }
            } else {
              data.push(res.data.data[i])
            }
          }
          setMenuDropdown(data)
        }
      })
    // console.log(menuDropdown);
  }, [activeModuleId, activeRoleId, userId])

  // return dropdown base field
  const getDropdown = (data) => {
    if (data.referenceName[0].reference === "sideMenuDropdown") {
      return menuDropdown
    } else if (data.name === "type" && code === "node") {
      return nodeDropdown
    } else if (data.name === "type") {
      return edgeDropdown
    } else if (data.name === "markerStart" || data.name === "markerEnd") {
      return markerDropdown
    } else if (data.name === "animated") {
      return animatedDropdown
    } else if (data.name === "markerOrient") {
      return orientDropdown
    } else return []
  }

  // set field value from redux state
  useEffect(() => {
    reset()
    if (code === "node") {
      // set from node state data
      reset(nodeState.data)
    } else {
      // set from edge state data
      reset({
        type: edgeState.type,
        label: edgeState.label ? edgeState.label : "",
        markerOrient: edgeState.markerStart
          ? edgeState.markerStart.orient
          : edgeState.markerEnd
            ? edgeState.markerEnd.orient
            : "auto",
        markerStart: edgeState.markerStart
          ? edgeState.markerStart.type
          : "none",
        markerEnd: edgeState.markerEnd ? edgeState.markerEnd.type : "none",
        animated: edgeState.animated ? edgeState.animated : false,
      })
    }
    if (nodeState.id != "") {
      fetchData()
    }
  }, [nodeState, edgeState])

  const fetchData = async () => {
    // reset()
    const id = nodeState.id
    try {
      setIsLoading(true)
      const res = await getFlowchartModal({ code, id, idParent })
      // const res = await getFlowchartModal({ code })
      if (res.data.status != "1") {
        setIsError(true)
        setErrorMessage(res.data.message)
        setForm([])
        window.Swal.fire("Kesalahan", res.data.message, "error")
        return
      }
      if (res.data.data && res.data.data.length) {
        setForm(res.data.data)
      }
      setIsError(false)
    } catch (error) {
      console.log(error)
      setIsError(true)
      setErrorMessage(error.message)
      window.Swal.fire("Kesalahan", error.message, "error")
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   console.log(code)
  // }, [code])

  // save data to elementState and close modal
  const onClickSave = async (data) => {
    const panel = []
    for (let [fieldId, fieldValue] of Object.entries(data)) {
      if (
        fieldId != "label" &&
        fieldId != "trackCode" &&
        fieldId != "sideMenu" &&
        fieldId != "preAction" &&
        fieldId != "postAction"
      ) {
        panel.push({ fieldId, fieldValue, panelId })
      }
    }
    const param = [
      {
        id: parent,
        value: idParent,
      },
    ]

    const payload = {
      panel,
      userId: userId,
      param,
      id: nodeState.id,
    }

    console.log(payload)

    const values = getValues()
    // console.log(values)
    if (!form.length) {
      return window.Swal.fire("Peringatan", "No Data", "error")
    }
    if (code === "node") {
      // set values to elementState.data
      // for node data
      dispatch(setElement({ data: values }))
      try {
        setLoadingSave(true)
        const res = await saveFlowchartModal(payload)
        if (res.data.status != "1") {
          return window.Swal.fire("Kesalahan", res.data.message, "error")
        }
        window.$("#editElement").modal("hide")
      } catch (e) {
        window.Swal.fire("Kesalahan", e.message, "error")
      } finally {
        setLoadingSave(false)
      }
    } else if (code === "edge") {
      // set set value to elementState
      // for edge data
      dispatch(setElement({ ...values }))
      window.$("#editElement").modal("hide")
    }
    // window.$("#editElement").modal("hide")
  }

  // useEffect(() => {
  //   if (modalRef) {
  //     modalRef.current.addEventListener("show", reset)
  //   }
  //   return () => {
  //     modalRef.current.removeEventListener("show", reset)
  //   }
  // }, [])

  // if (isError)
  //   return window.Swal.fire("Kesalahan", `Silahkan muat ulang modal`, "error")
  if (isLoading) return <div>Loading...</div>
  return (
    <div
      className="modal fade"
      id="editElement"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ubah {code}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {/* {isError && (
              <span className="text-sx text-danger">{errorMessage}</span>
            )} */}
            {code ? null : <div>Silahkan Pilih Elemen</div>}
            <div>
              {form.map((field, index) => {
                if (
                  field.type === "textbox" &&
                  nodeState.type === "businessProcess"
                ) {
                  return (
                    <InputCommon
                      id={field.id}
                      defaultValue={field.value}
                      fieldItem={field}
                      label={field.label}
                      isMandatory={field.isMandatory}
                      register={register}
                      key={index}
                      parent={[]}
                      child={[]}
                      watch={watch}
                      setValue={setValue}
                      showLabel={true}
                    />
                  )
                } else if (
                  field.type === "textbox" &&
                  !field.name.toLowerCase().includes("track")
                ) {
                  return (
                    <InputCommon
                      id={field.id}
                      defaultValue={field.value}
                      fieldItem={field}
                      label={field.label}
                      isMandatory={field.isMandatory}
                      register={register}
                      key={index}
                      parent={[]}
                      child={[]}
                      watch={watch}
                      setValue={setValue}
                      showLabel={true}
                    />
                  )
                } else if (
                  (field.type === "dropdown" &&
                    nodeState.type === "businessProcess") ||
                  (field.type === "dropdown" && code === "edge")
                ) {
                  const data = getDropdown(field)
                  return (
                    // {/* <InputDropdown key={index} item={data} /> */}
                    <div className="form-group" key={index}>
                      <label>
                        {field.label}
                        {field.isMandatory && (
                          <span className="text-danger font-weight-bold">
                            {" "}
                            *
                          </span>
                        )}
                      </label>
                      <select
                        className="custom-select rounded-sm"
                        {...register(field.name, {
                          required:
                            field.isMandatory === "1"
                              ? `${field.label} harus diisi`
                              : false,
                        })}
                      >
                        {field.name === "sideMenu"
                          ? data.map((option, index) => (
                              <option key={index} value={option.menuId}>
                                {option.menuDesc}
                              </option>
                            ))
                          : data.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                      </select>
                    </div>
                  )
                }
              })}
            </div>
          </div>
          <div className="modal-footer">
            {/* {isError && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={fetchData}
              >
                Refresh
              </button>
            )} */}
            <button
              type="button"
              onClick={handleSubmit(onClickSave)}
              className="btn btn-sm btn-success"
              disabled={loadingSave}
            >
              {loadingSave && <i className="fas fa-spinner fa-spin"></i>}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
