import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
// components
import Skeleton from "../Components/AutoLayout/Skeleton"
import Tab from "../Components/AutoLayout/Tab"
import ButtonType from "../Components/AutoLayout/ButtonType"
import FieldWithPanel from "../Components/AutoLayout/FieldWithPanel"
import Loading from "./Loading"
// service
import { getField, getTab } from "../Services/AutoLayoutService"
import { setFormPanel, setFormAction } from "../Store/Form/FormSlice"
import { setTabId } from "../Store/Menu/menuSlice"
import { setLoadingField } from "../Store/Loading/LoadingSlice"
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material"
import { handleGetListData, handleGetListStructure } from "../Utils/TableUtils"
import { setCurrentPayload, setFilteringList } from "../Store/List/listSlice"
import FullLoad from "./FullLoad"
import Inbox from "../Components/Inbox"

function AutoLayout({ className }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { state, pathname } = useLocation()
  // prettier-ignore
  const { register, handleSubmit, formState: { errors }, setValue, getValues, resetField, watch, clearErrors, control, unregister } = useForm({ mode: 'onChange' })
  // state
  const [tab, setTab] = useState()
  const [activeTabId, setActiveTabId] = useState("")
  // redux state
  const panelData = useSelector((state) => state.form.panel)
  const actionData = useSelector((state) => state.form.action)
  const user = useSelector((state) => state.user)
  const menu = useSelector((state) => state.menu)
  const loading = useSelector((state) => state.loading.field)
  const loadingSpin = useSelector((state) => state.loading.spin)
  const [checkStatus, setCheckStatus] = useState({
    value: null,
    desciption: "",
  })
  const [loader, showLoader, hideLoader] = FullLoad()
  const [dataQuery, setDataQuery] = useState()
  const filtering = useSelector((state) => state.list.filtering)
  const [structures, setStructures] = useState({})

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchData = async (menuId, pageIndex, pageSize, filtering) => {
    try {
      const payload = {
        userId: user.id,
        menuId: menuId,
        moduleId: user.activeModule.id,
        roleId: user.activeRole.id,
        filtering: filtering?.length ? filtering : [{ id: "", value: "" }],
        pagination: {
          pageIndex: pageIndex + 1,
          perPage: pageSize,
        },
      }
      dispatch(setCurrentPayload(payload))
      await handleGetListData(payload, setDataQuery)
    } catch (error) {
    } finally {
      hideLoader()
    }
  }

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  useEffect(() => {
    return () => {
      dispatch(setFilteringList([])) // reset filter when the component unmounts
    }
  }, [dispatch])

  // get structure
  useEffect(() => {
    if (menu) {
      setPagination({ pageIndex: 0, pageSize: 10 })
      handleGetListStructure(user, menu.activeMenuId, setStructures)
    }
  }, [menu, user])

  // get data
  useEffect(() => {
    if (menu) fetchData(menu.activeMenuId, pageIndex, pageSize, filtering)
  }, [menu, pageIndex, pageSize, filtering])

  const getFieldByForm = async (payload) => {
    await getField(payload)
      .then((res) => {
        if (res.data.status != "1") {
          return window.Swal.fire("Kesalahan", res.data.message, "error")
        }
        if (payload.tabId === activeTabId) {
          dispatch(setFormPanel(res.data.panel))
          dispatch(setFormAction(res.data.action))
          if (res.data.checked) {
            setCheckStatus(res.data.checked)
          }
        }
      })
      .catch((error) => {
        window.Swal.fire("Error", error.message, error)
      })
      .finally(() => {
        dispatch(setLoadingField(false))
      })
  }

  useEffect(() => {
    dispatch(setFormPanel([]))
    // handle form reload by menuId condition
    if (menu.activeMenuId === "") return navigate("/dashboard")
    // handle tab
    let param = ""
    if (state && state.param && state.param.length) {
      param = state.param[0].value
    } else if (pathname != "/form") {
      return
    }
    const payload = {
      menuId: menu.activeMenuId,
      moduleId: user.activeModule.id,
      param: param,
    }
    getTab(payload)
      .then((res) => {
        if (res.data.status != "1") {
          return window.Swal.fire("Kesalahan", res.data.response, "error")
        }
        setTab(res.data.data)
        // by default, set active tab = first tab index
        dispatch(setTabId(res.data.data[0].id))
        setActiveTabId(res.data.data[0].id)
      })
      .catch((error) => {
        // console.log(error)
        window.Swal.fire("Error", error.message, "error")
      })
  }, [menu.activeMenuId])

  const reset = () => {
    let param = ""
    if (state && state.param && state.param.length) {
      param = state.param[0].value
    } else {
      return
    }
    const payload = {
      menuId: menu.activeMenuId,
      moduleId: user.activeModule.id,
      param: param,
    }
    getTab(payload)
      .then((res) => {
        if (res.data.status != "1") {
          return window.Swal.fire("Kesalahan", res.data.response, "error")
        }
        setTab(res.data.data)
        // by default, set active tab = first tab index
        // dispatch(setTabId(res.data.data[0].id))
        // setActiveTabId(res.data.data[0].id)
      })
      .catch((error) => {
        // console.log(error)
        window.Swal.fire("Error", error.message, "error")
      })
  }

  useEffect(() => {
    console.log(state)
  }, [state])

  // handle get field
  useEffect(() => {
    if (activeTabId !== "" && menu.activeMenuId !== "") {
      dispatch(setLoadingField(true))
      let payload = {
        tabId: activeTabId,
        tc: menu.activeTrackId,
        userId: user.id,
        param: state?.param || [],
      }
      // if (id && value) {
      //   payload = {
      //     ...payload,
      //     param: [
      //       {
      //         id,
      //         value,
      //       },
      //     ],
      //   }
      // }
      // if (pathname != "/form" && !id && !value) {
      //   return
      // }
      // get field by payload
      getFieldByForm(payload)
    }
  }, [activeTabId, menu.activeMenuId])

  return (
    <div className="d-md-flex">
      <Inbox
        // className={"col-md-3"}
        pageIndex={pageIndex}
        pageSize={pageSize}
        fetchData={fetchData}
        setPagination={setPagination}
        dataQuery={dataQuery}
        setDataQuery={setDataQuery}
        structures={structures}
        setStructures={setStructures}
      />
      <div
        className={`overflow-y-auto bg-white col-md-9`}
        style={{
          height: "85vh",
          // width: '100%',
        }}
      >
        {loadingSpin && <Loading />}
        {!panelData || !tab ? (
          <Skeleton />
        ) : (
          <div className="overflow-auto h-100 card card-danger">
            <div className="card-header">
              <div className="">
                <h3 className="card-title">{state.param[0]?.value}</h3>
                {/* <span className="info-box-icon">
                <i className="far fa-bookmark"></i>
              </span> */}
                {/* <div className="info-box-content">
                <span className="info-box-number text-md">
                  {value}
                </span>
              </div> */}
              </div>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool"
                  data-card-widget="maximize"
                >
                  <i className="fas fa-expand"></i>
                </button>
                {/* <button
                type="button"
                className="btn btn-tool"
                data-card-widget="collapse"
              >
                <i className="fas fa-minus"></i>
              </button> */}
              </div>
            </div>
            {/* )} */}
            <Tab
              reset={reset}
              data={tab}
              activeTabId={activeTabId}
              setActiveTabId={setActiveTabId}
            />

            <div className="pt-4">
              {loading && <Skeleton />}
              <FieldWithPanel
                panelData={panelData}
                activeTabId={activeTabId}
                register={register}
                handleSubmit={handleSubmit}
                unregister={unregister}
                setValue={setValue}
                getValues={getValues}
                clearErrors={clearErrors}
                errors={errors}
                resetField={resetField}
                watch={watch}
                control={control}
                pageIndex={pageIndex}
                pageSize={pageSize}
                fetchData={fetchData}
              />
              {!loading && panelData.length <= 0 && (
                <p className="text-center text-muted">Data kosong</p>
              )}
            </div>

            {!loading && (
              <div className="card-footer border-0">
                <div className="d-flex justify-content-between align-items-center ">
                  <div className="d-flex align-items-center">
                    {checkStatus.value == "1" ? (
                      <CheckBox className="text-info" />
                    ) : checkStatus.value == "0" ? (
                      <CheckBoxOutlineBlank className="text-secondary" />
                    ) : null}
                    <span>{checkStatus.desciption}</span>
                  </div>
                  <div>
                    {actionData?.map((actionItem) => (
                      <ButtonType
                        resetTab={reset}
                        key={actionItem.actionId}
                        buttonItem={actionItem}
                        panelList={panelData}
                        handleSubmit={handleSubmit}
                        getValues={getValues}
                        setValue={setValue}
                        saveEndpoint="/savedata"
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        fetchData={fetchData}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AutoLayout
