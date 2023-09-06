import { handleFieldRule } from '../../../Utils/FieldRuleUtils'

function InputPassword({ id, fieldItem, register }) {
  return (
    <>
      <label onClick={() => console.log(fieldItem)}>
        {fieldItem.label}
        {fieldItem.isMandatory === '1' && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <input
        type="password"
        id={id}
        className="form-control form-control-sm"
        {...register(id, handleFieldRule(fieldItem))}
      />
    </>
  )
}

export default InputPassword
