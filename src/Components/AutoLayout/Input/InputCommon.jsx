import React, { useEffect } from 'react'
import { useMemo } from 'react'
import { NumericFormat } from 'react-number-format'
import { getChildValueByChildParent } from '../../../Utils/FieldReferenceUtils'
import { handleFieldRule } from '../../../Utils/FieldRuleUtils'
import InputGroup from '../../InputGroup'

const numericRules = [
  'currencyAbsolute',
  'currency',
  'numericAbsolute',
  'numeric',
]

function InputFormat({
  id,
  fieldItem,
  register,
  watch,
  rule,
  setValue,
  handleOnBlur,
  handleKeyDown,
  defaultValue,
  className,
}) {
  const watchHiddenInput = watch(id, defaultValue)

  return (
    <>
      {fieldItem.groupInput ? (
        <InputGroup fieldItem={fieldItem}>
          <input type="hidden" id={id} {...register} />
          <NumericFormat
            value={
              watchHiddenInput === ''
                ? ''
                : rule === 'numericAbsolute'
                ? watchHiddenInput
                : +watchHiddenInput
            }
            type="text"
            allowNegative={
              ['numericAbsolute', 'currencyAbsolute'].includes(rule)
                ? false
                : true
            }
            allowLeadingZeros={rule === 'numericAbsolute' ? true : false}
            className={'form-control ' + className}
            thousandsGroupStyle="thousand"
            thousandSeparator={
              ['numericAbsolute', 'numeric'].includes(rule) ? false : ','
            }
            onBlur={handleOnBlur}
            onValueChange={(values) => {
              setValue(id, values.value, { shouldValidate: true })
              const hiddenInput = document.getElementById(id)
              hiddenInput.dispatchEvent(new Event('change'))
            }}
            readOnly={fieldItem.isReadOnly === '1' || false}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
      ) : (
        <>
          <input type="hidden" id={id} {...register} />
          <NumericFormat
            value={
              watchHiddenInput === ''
                ? ''
                : rule === 'numericAbsolute'
                ? watchHiddenInput
                : +watchHiddenInput
            }
            type="text"
            allowNegative={
              ['numericAbsolute', 'currencyAbsolute'].includes(rule)
                ? false
                : true
            }
            allowLeadingZeros={rule === 'numericAbsolute' ? true : false}
            className={'form-control ' + className}
            thousandsGroupStyle="thousand"
            thousandSeparator={
              ['numericAbsolute', 'numeric'].includes(rule) ? false : ','
            }
            onBlur={handleOnBlur}
            onValueChange={(values) => {
              setValue(id, values.value, { shouldValidate: true })
              const hiddenInput = document.getElementById(id)
              hiddenInput.dispatchEvent(new Event('change'))
              if (['Persentase', 'Nominal Biaya'].includes(fieldItem.label)) {
                handleOnBlur()
              }
            }}
            readOnly={fieldItem.isReadOnly === '1' || false}
            onKeyDown={handleKeyDown}
          />
        </>
      )}
    </>
  )
}

export default function InputCommon({
  fieldItem,
  fieldList,
  panelList,
  label,
  id,
  register,
  control,
  setValue,
  resetField,
  getValues,
  watch,
  hide,
  parent,
  child,
  defaultValue,
  filter,
  showLabel,
  className,
  ...props
}) {
  const fieldRule = useMemo(() => handleFieldRule(fieldItem), [])

  const handleOnBlur = () => {
    // if has child
    if (child.length) {
      child.forEach((childId) => {
        // console.log('get child')
        getChildValueByChildParent(childId, panelList, getValues, setValue)
      })
    }
  }

  useEffect(() => {
    defaultValue && setValue(id, defaultValue)

    // hide field
    if (fieldItem.hide === '1') {
      const currentEl = document.getElementById(id)
      currentEl.parentElement.parentElement.style.display = 'none'
    }

    if (parent && parent.length) {
      parent.forEach((parentId) => {
        const parentEl = document.getElementById(parentId)
        if (parentEl) {
          let eventType = parentEl.tagName === 'INPUT' ? 'input' : 'change'
          parentEl.addEventListener(eventType, () => {
            // reset current field value
            resetField(id)
            const currentFieldEl = document.getElementById(id)
            currentFieldEl.dispatchEvent(new Event('change'))
            // reset child value
            if (child.length) {
              child.forEach((childId) => {
                resetField(childId)
                const childEl = document.getElementById(childId)
                childEl.dispatchEvent(new Event('change'))
              })
            }
          })
        }
      })
    }

    if (fieldItem.isReadOnly === '1') {
      document.getElementById(id).addEventListener('change', handleOnBlur)
    }
  }, [])

  // handle on type
  const handleKeyDown = (e) => {
    if (fieldItem.maxLength) {
      const maxLength = Number(fieldItem.maxLength) // set maximum length here
      const allowedKeys = ['Backspace', 'Delete', 'Tab']
      const isCtrlA = e.ctrlKey && e.key === 'a'
      // all allowed key
      const isAllowed =
        e.target.value.length < maxLength ||
        allowedKeys.includes(e.key) ||
        isCtrlA
      // if not allowed
      if (!isAllowed) {
        e.preventDefault()
      }
    }
  }

  useEffect(() => {
    setValue(id, defaultValue)
    // hardcode
    if (id === 'VDCD10001_002_029_001') {
      const nomorKtpDebitur = getValues('VDCD10001_001_001')
      setValue(id, nomorKtpDebitur)
    }
  }, [defaultValue])

  const watchNoKtp = watch('PA10001_001_001')
  useEffect(() => {
    if (document.getElementById('PA10001_002_001_001')) {
      setValue('PA10001_002_001_001', watchNoKtp)
    }
  }, [watchNoKtp])

  // set value after filter
  // useEffect(() => {
  //   if (fieldItem.label === filter[0].label) {
  //     setValue(id, filter[0].value)
  //   }
  // }, [filter])

  return (
    <>
      {showLabel && (
        <label onClick={() => console.log(fieldItem)}>
          {fieldItem.label}
          {fieldItem.isMandatory === '1' && (
            <span className="text-danger font-weight-bold"> *</span>
          )}
        </label>
      )}
      {numericRules.includes(fieldItem.rule) ? (
        <InputFormat
          id={id}
          fieldItem={fieldItem}
          rule={fieldItem.rule}
          register={register(id, fieldRule)}
          watch={watch}
          setValue={setValue}
          handleOnBlur={handleOnBlur}
          handleKeyDown={handleKeyDown}
          defaultValue={defaultValue}
          className={className}
        />
      ) : (
        <>
          {fieldItem.groupInput ? (
            <InputGroup fieldItem={fieldItem}>
              <input
                id={id}
                type="text"
                className={'form-control form-control-sm ' + className}
                defaultValue={defaultValue || ''}
                {...register(id, fieldRule)}
                onBlur={handleOnBlur}
                readOnly={fieldItem.isReadOnly == '1' || false}
              />
            </InputGroup>
          ) : (
            <>
              {fieldItem.rule === 'alphaonly' ? (
                <input
                  id={id}
                  type="text"
                  className={'form-control form-control-sm ' + className}
                  defaultValue={defaultValue || ''}
                  {...register(id, fieldRule)}
                  onBlur={handleOnBlur}
                  onKeyDown={handleKeyDown}
                  readOnly={fieldItem.isReadOnly == '1' || false}
                />
              ) : (
                <input
                  id={id}
                  type="text"
                  className="form-control form-control-sm"
                  defaultValue={defaultValue || ''}
                  {...register(id, fieldRule)}
                  onBlur={handleOnBlur}
                  onKeyDown={handleKeyDown}
                  readOnly={fieldItem.isReadOnly == '1' || false}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
