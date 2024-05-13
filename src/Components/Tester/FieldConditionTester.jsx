import { useForm } from "react-hook-form"
import { condition } from "../../Data/Field/condition"
import FieldType from "../AutoLayout/FieldType"

function FieldConditionTester({
  pageIndex = 0,
  pageSize = 10,
  fetchData = () => {},
}) {
  // prettier-ignore
  const { register, clearErrors, unregister, control, handleSubmit, setValue, resetField, getValues, watch, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    // console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Field Condition</h3>
      <div className="row">
        {condition.map((fieldItem, index) => (
          <FieldType
            key={fieldItem.id}
            fieldItem={fieldItem}
            fieldList={condition}
            control={control}
            register={register}
            clearErrors={clearErrors}
            setValue={setValue}
            resetField={resetField}
            getValues={getValues}
            watch={watch}
            errors={errors}
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

export default FieldConditionTester
