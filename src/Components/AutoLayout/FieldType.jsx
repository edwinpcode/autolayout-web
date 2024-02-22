import { ErrorMessage } from "@hookform/error-message"
import DropdownSelect from "./Input/DropdownSelect"
import InputCommon from "./Input/InputCommon"
import InputDate from "./Input/InputDate"
import InputFile from "./Input/InputFile"
import Flowchart from "../../Pages/Flowchart"
import InputRadio from "./Input/InputRadio"
import InputTextboxWithButton from "./Input/InputTextboxWithButton"
import InputDatetime from "./Input/InputDatetime"
import InputTime from "./Input/InputTime"
import TableGrid from "../../Pages/TableGrid"
import InputTextareaWithCheckbox from "./Input/InputTextareaWithCheckbox"
import CheckboxCopyValue from "./Input/CheckboxCopyValue"
import BoxForm from "./Box/BoxForm"
import ReportForm from "../AutoLayout/Chart/ReportForm"
import ChartForm from "../AutoLayout/Chart/ChartForm"
import ButtonForm from "../Button/ButtonForm"
import { handleFieldRule } from "../../Utils/FieldRuleUtils"
import ButtonType from "./ButtonType"
import InputPassword from "./Input/InputPassword"
import InputTextArea from "./Input/InputTextArea"
import InputTextWithAudio from "./Input/InputTextWithAudio"

/* 
  note:
  # FieldType => dipakai untuk return komponen sesuai tipe field
  fieldItem: item per field (hasil looping listField)
  fieldList: listField array
  register, setValue, resetField, errors: dari react-hook-form
  activeTabId: (optional) dipake untuk grid di dalam tab 
*/
function FieldType({
  panel = [],
  fieldItem,
  fieldList,
  register,
  setValue,
  getValues,
  resetField,
  errors,
  activeTabId,
  watch,
  clearErrors,
  control,
  unregister,
  filter,
  pageSize = 10,
  pageIndex = 0,
  fetchData = () => {},
  gridItem,
}) {
  // console.log(panel)
  return (
    <>
      {["textbox", "email"].includes(fieldItem.type) && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <div className="form-group">
            <InputCommon
              showLabel={true}
              fieldItem={fieldItem}
              fieldList={fieldList}
              panelList={panel}
              id={fieldItem.id}
              parent={fieldItem.reference?.parent || []}
              child={fieldItem.reference?.child || []}
              defaultValue={fieldItem.value}
              getValues={getValues}
              setValue={setValue}
              watch={watch}
              resetField={resetField}
              hide={fieldItem.hide == "1" || false}
              register={register}
              filter={filter}
              className={fieldItem.className || ""}
            />
            <ErrorMessage
              errors={errors}
              name={fieldItem.id}
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "textarea" && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <div className="form-group">
            <InputTextArea
              fieldItem={fieldItem}
              defaultValue={fieldItem.value}
              register={register(fieldItem.id, handleFieldRule(fieldItem))}
            />
            <ErrorMessage
              errors={errors}
              name={fieldItem.id}
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "radio" && (
        <div className={`col-md-${fieldItem.width}`}>
          <InputRadio
            data={fieldItem}
            id={fieldItem.id}
            setValue={setValue}
            panel={panel}
            getValues={getValues}
            readOnly={fieldItem.isReadOnly === "1" || false}
            listField={fieldList}
            isReadOnly={fieldItem.isReadOnly === "1" || false}
            defaultValue={fieldItem.valueList}
            condition={fieldItem.condition || []}
            hide={fieldItem.hide === "" || false}
            register={register(fieldItem.id, handleFieldRule(fieldItem))}
            unregister={unregister}
          />
          <ErrorMessage
            errors={errors}
            name={fieldItem.id}
            as="div"
            style={{ color: "red", marginTop: "5px" }}
          />
        </div>
      )}
      {fieldItem.type === "dropdown" && (
        <div
          className={`col-md-${fieldItem.width || "12"} ${
            fieldItem.hide == "1" ? "hidden" : ""
          }`}
        >
          <div className="form-group">
            <DropdownSelect
              label={fieldItem.label}
              id={fieldItem.id}
              panel={panel}
              listField={fieldList}
              fieldItem={fieldItem}
              parent={fieldItem.reference?.parent || []}
              child={fieldItem.reference?.child || []}
              resetField={resetField}
              readOnly={fieldItem.isReadOnly === "1" || false}
              getValues={getValues}
              setValue={setValue}
              defaultValue={fieldItem.valueList}
              condition={fieldItem.condition || []}
              isMandatory={fieldItem.isMandatory === "1" || false}
              isReadOnly={fieldItem.isReadOnly === "1" || false}
              unregister={unregister}
              register={register(fieldItem.id, handleFieldRule(fieldItem))}
            />
            <ErrorMessage
              errors={errors}
              name={fieldItem.id}
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "datetime" && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <div className="form-group">
            <InputDatetime
              child={fieldItem.reference?.child || []}
              defaultValue={fieldItem.value}
              hide={fieldItem.hide === "1" || false}
              id={fieldItem.id}
              isMandatory={fieldItem.isMandatory === "1" ? true : false}
              label={fieldItem.label}
              readOnly={fieldItem.isReadOnly === "1" || false}
              register={register(fieldItem.id, handleFieldRule(fieldItem))}
              setValue={setValue}
              view={fieldItem.view}
              watch={watch}
            />
            <ErrorMessage
              errors={errors}
              name={fieldItem.id}
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      )}
      {["date", "dateDown"].includes(fieldItem.type) && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <div className="form-group">
            <InputDate
              fieldItem={fieldItem}
              child={fieldItem.reference?.child || []}
              defaultValue={fieldItem.value}
              hide={fieldItem.hide === "1" || false}
              id={fieldItem.id}
              isMandatory={fieldItem.isMandatory === "1" ? true : false}
              label={fieldItem.label}
              disabled={fieldItem.isReadOnly == "1" || false}
              register={register(fieldItem.id, handleFieldRule(fieldItem))}
              setValue={setValue}
              view={fieldItem.view}
              watch={watch}
              panel={panel}
              fieldList={fieldList}
              getValues={getValues}
              resetField={resetField}
            />
            <ErrorMessage
              errors={errors}
              name={fieldItem.id}
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "time" && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <div className="form-group">
            <InputTime
              child={fieldItem.reference?.child || []}
              defaultValue={fieldItem.value}
              hide={fieldItem.hide === "1" || false}
              id={fieldItem.id}
              isMandatory={fieldItem.isMandatory === "1" ? true : false}
              label={fieldItem.label}
              register={register(fieldItem.id, handleFieldRule(fieldItem))}
              setValue={setValue}
              view={fieldItem.view}
              watch={watch}
            />
            <ErrorMessage
              errors={errors}
              name={fieldItem.id}
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "file" && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <InputFile
            fieldItem={fieldItem}
            register={register}
            maxLength={fieldItem.maxLength}
          />
          <ErrorMessage
            errors={errors}
            name={fieldItem.id}
            as="div"
            style={{ color: "red", marginTop: "-15px" }}
          />
        </div>
      )}
      {fieldItem.type === "grid" && (
        <div className="col-md-12">
          <TableGrid
            gridItem={fieldItem}
            activeTabId={activeTabId}
            watch={watch}
            getValues={getValues}
          />
        </div>
      )}
      {fieldItem.type === "flowchart" && (
        <div className="mx-1 w-100">
          <Flowchart
            fieldItem={fieldItem}
            getValues={getValues}
            watch={watch}
            panel={panel}
          />
        </div>
      )}
      {fieldItem.type === "textboxwithbutton" && (
        <div className={`col-md-${fieldItem.width || "12"}`} key={fieldItem.id}>
          <div className="form-group">
            <InputTextboxWithButton
              fieldItem={fieldItem}
              fieldList={fieldList}
              panel={panel}
              button={fieldItem.button}
              child={fieldItem.reference?.child || []}
              defaultValue={fieldItem.value}
              flag={fieldItem.flag}
              isMandatory={fieldItem.isMandatory === "1" ? true : false}
              label={fieldItem.label}
              parent={fieldItem.reference?.parent || []}
              path={fieldItem.path}
              readOnly={fieldItem.isReadOnly === "1" || false}
              width={fieldItem.width}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "textboxwithaudio" && (
        <div className={`col-md-${fieldItem.width || "12"}`} key={fieldItem.id}>
          <div className="form-group">
            <InputTextWithAudio
              fieldItem={fieldItem}
              fieldList={fieldList}
              panel={panel}
              button={fieldItem.button}
              child={fieldItem.reference?.child || []}
              defaultValue={fieldItem.value}
              flag={fieldItem.flag}
              isMandatory={fieldItem.isMandatory === "1" ? true : false}
              label={fieldItem.label}
              parent={fieldItem.reference?.parent || []}
              path={fieldItem.path}
              readOnly={fieldItem.isReadOnly === "1" || false}
              width={fieldItem.width}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "textareawithcheckbox" && (
        <div className={`col-md-${fieldItem.width || "12"}`} key={fieldItem.id}>
          <div className="form-group">
            <InputTextareaWithCheckbox
              child={fieldItem.reference?.child || []}
              checkbox={fieldItem.checkbox}
              defaultValue={fieldItem.value}
              flag={fieldItem.flag}
              getValues={getValues}
              hide={fieldItem.hide === "1" || false}
              id={fieldItem.id}
              isMandatory={fieldItem.isMandatory === "1" ? true : false}
              label={fieldItem.label}
              parent={fieldItem.reference?.parent || []}
              path={fieldItem.path}
              readOnly={fieldItem.isReadOnly === "1" || false}
              register={register(fieldItem.id, handleFieldRule(fieldItem))}
              resetField={resetField}
              setValue={setValue}
              watch={watch}
              width={fieldItem.width}
            />
            <ErrorMessage
              errors={errors}
              name={fieldItem.id}
              as="div"
              style={{ color: "red", marginTop: "5px" }}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "checkboxcopyvalue" && (
        <div className={`col-md-${fieldItem.width || "12"}`} key={fieldItem.id}>
          <div className="form-group">
            <CheckboxCopyValue
              child={fieldItem.reference?.child || []}
              control={control}
              defaultValue={fieldItem.value}
              flag={fieldItem.flag}
              getValues={getValues}
              hide={fieldItem.hide === "1" || false}
              id={fieldItem.id}
              isMandatory={fieldItem.isMandatory === "1" ? true : false}
              label={fieldItem.label}
              parent={fieldItem.reference?.parent || []}
              path={fieldItem.path}
              readOnly={fieldItem.isReadOnly === "1" || false}
              resetField={resetField}
              setValue={setValue}
              watch={watch}
              width={fieldItem.width}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "box" && (
        <div className={`col-${fieldItem.width}`}>
          <BoxForm
            level={fieldItem.dataset[0].level}
            fieldId={fieldItem.dataset[0].fieldId}
            path={fieldItem.dataset[0].path}
            width={fieldItem.width}
          />
        </div>
      )}
      {fieldItem.type === "chart" && (
        <div className={`col-${fieldItem.width}`}>
          <ReportForm
            level={fieldItem.dataset[0].level}
            fieldId={fieldItem.id}
            path={fieldItem.dataset[0].path}
          />
        </div>
      )}
      {fieldItem.type === "button" && (
        <ButtonType
          buttonItem={fieldItem}
          panelList={panel}
          getValues={getValues}
          fetchData={fetchData}
          pageIndex={pageIndex}
          pageSize={pageSize}
          gridItem={gridItem}
        />
      )}
      {fieldItem.type === "password" && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <div className="form-group">
            <InputPassword
              id={fieldItem.id}
              fieldItem={fieldItem}
              register={register}
            />
          </div>
        </div>
      )}
      {fieldItem.type === "linkmaps" && (
        <div className={`col-md-${fieldItem.width || "12"}`}>
          <div className="form-group">
            <ButtonType
              buttonItem={fieldItem}
              panelList={panel}
              getValues={getValues}
              fetchData={fetchData}
              pageIndex={pageIndex}
              pageSize={pageSize}
              gridItem={gridItem}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default FieldType
