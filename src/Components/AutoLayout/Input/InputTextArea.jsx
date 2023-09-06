function InputTextArea({ fieldItem, register, defaultValue }) {
  return (
    <>
      <label onClick={() => console.log(fieldItem)}>
        {fieldItem.label}{' '}
        {fieldItem.isMandatory === '1' && (
          <span className="text-danger font-weight-bold"> *</span>
        )}
      </label>
      <textarea
        id={fieldItem.id}
        className="form-control"
        rows="3"
        placeholder={`Masukkan ${fieldItem.label}`}
        readOnly={fieldItem.isReadOnly === '1'}
        defaultValue={defaultValue}
        {...register}
      ></textarea>
    </>
  )
}

export default InputTextArea
