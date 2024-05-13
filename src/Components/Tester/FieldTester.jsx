import { useForm } from "react-hook-form"
import FieldType from "../AutoLayout/FieldType"

const fieldList = [
  {
    id: "curabs",
    label: "Currency Absolute",
    type: "textbox",
    maxLength: "100",
    isMandatory: "1",
    rule: "currencyAbsolute",
    isReadOnly: "1",
    width: "6",
    isMultiple: "",
    hide: "",
    value: "10000000",
    reference: {},
  },
  {
    id: "cur",
    label: "Currency",
    type: "textbox",
    maxLength: "100",
    isMandatory: "1",
    rule: "currency",
    isReadOnly: "1",
    width: "6",
    isMultiple: "",
    hide: "",
    value: "-12345",
    reference: {},
  },
  {
    id: "numabs",
    label: "Numeric Absolute",
    type: "textbox",
    maxLength: "20",
    isMandatory: "1",
    rule: "numericAbsolute",
    isReadOnly: "1",
    width: "6",
    isMultiple: "",
    hide: "",
    value: "1241242141",
    reference: {},
  },
  {
    id: "num",
    label: "Numeric",
    type: "textbox",
    maxLength: "20",
    isMandatory: "1",
    rule: "numeric",
    isReadOnly: "1",
    width: "6",
    isMultiple: "",
    hide: "",
    value: "987655776",
    reference: {},
  },
  {
    id: "biasa",
    label: "Input Biasa",
    type: "textbox",
    maxLength: "20",
    isMandatory: "1",
    rule: "",
    isReadOnly: "0",
    width: "6",
    isMultiple: "",
    hide: "",
    value: "987655776",
    reference: {},
  },
]

function FieldTester({ pageIndex = 0, pageSize = 10, fetchData = () => {} }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    resetField,
    watch,
    clearErrors,
    control,
  } = useForm({ mode: "onChange" })

  const onSubmit = (data) => {
    // console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {fieldList.map((fieldItem, index) => (
          <FieldType
            key={fieldItem.id}
            fieldItem={fieldItem}
            fieldList={fieldList}
            register={register}
            setValue={setValue}
            getValues={getValues}
            clearErrors={clearErrors}
            resetField={resetField}
            errors={errors}
            watch={watch}
            control={control}
            pageIndex={pageIndex}
            pageSize={pageSize}
            fetchData={fetchData}
            index={index}
          />
        ))}
      </div>
      <button type="submit">submit</button>
    </form>
  )
}

export default FieldTester
