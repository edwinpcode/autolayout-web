import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
// components
import Skeleton from '../Components/AutoLayout/Skeleton'
import Tab from '../Components/AutoLayout/Tab'
import ButtonType from '../Components/AutoLayout/ButtonType'
import FieldWithPanel from '../Components/AutoLayout/FieldWithPanel'
import Loading from './Loading'
// service
import { getField, getTab } from '../Services/AutoLayoutService'
import { setFormPanel, setFormAction } from '../Store/Form/FormSlice'
import { setTabId } from '../Store/Menu/menuSlice'
import { setLoadingField } from '../Store/Loading/LoadingSlice'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'

function AutoLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { state } = useLocation()
  // prettier-ignore
  const { register, handleSubmit, formState: { errors }, setValue, getValues, resetField, watch, clearErrors, control, unregister } = useForm({ mode: 'onChange' })
  // state
  const [tab, setTab] = useState()
  const [activeTabId, setActiveTabId] = useState('')
  // redux state
  const panelData = useSelector((state) => state.form.panel)
  const actionData = useSelector((state) => state.form.action)
  const user = useSelector((state) => state.user)
  const menu = useSelector((state) => state.menu)
  const loading = useSelector((state) => state.loading.field)
  const loadingSpin = useSelector((state) => state.loading.spin)
  const [checkStatus, setCheckStatus] = useState({
    value: null,
    desciption: '',
  })

  const getFieldByForm = async (payload) => {
    await getField(payload)
      .then((res) => {
        if (res.data.status != '1') {
          return window.Swal.fire('Kesalahan', res.data.message, 'error')
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
        window.Swal.fire('Error', error.message, error)
      })
      .finally(() => {
        dispatch(setLoadingField(false))
      })
  }

  useEffect(() => {
    dispatch(setFormPanel([]))
    // handle form reload by menuId condition
    if (menu.activeMenuId === '') return navigate('/dashboard')
    // handle tab
    let param = ''
    if (state && state.param && state.param.length) {
      param = state.param[0].value
    }
    const payload = {
      menuId: menu.activeMenuId,
      moduleId: user.activeModule.id,
      param: param,
    }
    getTab(payload).then((res) => {
      if (res.data.status != '1') {
        return window.Swal.fire('Kesalahan', res.data.response, 'error')
      }
      setTab(res.data.data)
      // by default, set active tab = first tab index
      dispatch(setTabId(res.data.data[0].id))
      setActiveTabId(res.data.data[0].id)
    })
  }, [menu.activeMenuId])

  const reset = () => {
    let param = ''
    if (state && state.param && state.param.length) {
      param = state.param[0].value
    }
    const payload = {
      menuId: menu.activeMenuId,
      moduleId: user.activeModule.id,
      param: param,
    }
    getTab(payload).then((res) => {
      if (res.data.status != '1') {
        return window.Swal.fire('Kesalahan', res.data.response, 'error')
      }
      setTab(res.data.data)
      // by default, set active tab = first tab index
      // dispatch(setTabId(res.data.data[0].id))
      // setActiveTabId(res.data.data[0].id)
    })
  }

  // handle get field
  useEffect(() => {
    if (activeTabId !== '' && menu.activeMenuId !== '') {
      dispatch(setLoadingField(true))
      const payload = {
        tabId: activeTabId,
        tc: menu.activeTrackId,
        userId: user.id,
        param: state?.param || [],
      }
      // get field by payload
      getFieldByForm(payload)
    }
  }, [activeTabId, menu.activeMenuId])

  return (
    <>
      {loadingSpin && <Loading />}
      {!panelData || !tab ? (
        <Skeleton />
      ) : (
        <form>
          {state?.param?.length > 0 && (
            <div className="info-box bg-danger">
              <span className="info-box-icon">
                <i className="far fa-bookmark"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-number text-md">
                  {/* first list field value */}
                  {state.param[0].value}
                </span>
              </div>
            </div>
          )}
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
            />
            {!loading && panelData.length <= 0 && (
              <p className="text-center text-muted">Data kosong</p>
            )}
          </div>

          {!loading && (
            <div className="card-footer border-0">
              <div className="d-flex justify-content-between align-items-center ">
                <div className="d-flex align-items-center">
                  {checkStatus.value == '1' ? (
                    <CheckBox className="text-info" />
                  ) : checkStatus.value == '0' ? (
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
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>
      )}
    </>
  )
}

export default AutoLayout
