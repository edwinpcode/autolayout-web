import React, { useEffect, useState } from "react"
import FullLoad from "../../../Pages/FullLoad"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { getDataActionWithButton } from "../../../Services/AutoLayoutService"
import { setFormAction, setFormPanel } from "../../../Store/Form/FormSlice"
import { resetDropdown, setDropdown } from "../../../Store/Input/DropdownSlice"
import {
  setLoadingField,
  setLoadingSpin,
} from "../../../Store/Loading/LoadingSlice"
import InputCommon from "./InputCommon"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

const InputTextboxWithButton = ({
  button,
  child,
  defaultValue,
  flag,
  fieldItem,
  fieldList,
  isMandatory,
  label,
  panel,
  parent,
  path,
  width,
  ...props
}) => {
  const { state } = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // prettier-ignore
  const { register, handleSubmit, formState: { errors }, getValues, setValue, resetField, watch, clearErrors, } = useForm()
  // redux
  const userId = useSelector((state) => state.user.id)
  const menu = useSelector((state) => state.menu)

  const onClick = async () => {
    dispatch(setFormPanel([]))
    dispatch(setFormAction([]))
    dispatch(setLoadingField(true))
    dispatch(setLoadingSpin(true))
    const payload = {
      type: button[0].id,
      tabId: menu.activeTabId,
      tc: menu.activeTrackId,
      userId: userId,
      param: [{ id: fieldItem.id, value: getValues(fieldItem.id) }],
    }
    await getDataActionWithButton(button[0].path, payload).then((res) => {
      dispatch(setLoadingSpin(false))
      dispatch(setLoadingField(false))
      // nik baru (tidak ditemukan)
      if (res.data.status == "0") {
        // navigate(`/${menuId}/${id}/${value}`, { state: { param: [] } })
        navigate("/", { state: { param: [] } })
        dispatch(setFormPanel(res.data.panel))
        dispatch(setFormAction(res.data.action))
        return window.Swal.fire("", res.data.message, "warning")
      }
      // nik ditemukan
      if (res.data.status == "1") {
        dispatch(setFormPanel(res.data.panel))
        dispatch(setFormAction(res.data.action))
        return window.Swal.fire("", res.data.message, "success")
      }
      // nik dalam pengajuan
      if (res.data.status == "2") {
        // navigate(`/${menuId}`)
        navigate("/")
        return window.Swal.fire("", res.data.message, "warning")
      }
    })
  }

  return (
    <>
      <label className={`${fieldItem.hide ? "hidden" : ""}`}>
        {label}
        {isMandatory && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <div className="input-group">
        <InputCommon
          showLabel={false}
          fieldItem={fieldItem}
          fieldList={fieldList}
          panelList={panel}
          id={fieldItem.id}
          parent={[]}
          child={[]}
          defaultValue={fieldItem.value}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
          resetField={resetField}
          hide={fieldItem.hide == "1" || false}
          register={register}
        />
        <span className="input-group-append">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleSubmit(onClick)}
          >
            {button[0].label}
          </button>
        </span>
      </div>
      <ErrorMessage
        errors={errors}
        name={fieldItem.id}
        as="div"
        style={{ color: "red", marginTop: "5px" }}
      />
    </>
  )
}

export default InputTextboxWithButton
