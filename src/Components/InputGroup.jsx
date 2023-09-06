function InputGroup({ fieldItem, children }) {
  return (
    <div className="input-group input-group-sm">
      {fieldItem.groupInput.position === 'start' && (
        <div className="input-group-prepend">
          <span className="input-group-text">
            {fieldItem.groupInput.type === 'icon' ? (
              <i className={fieldItem.groupInput.value}></i>
            ) : (
              <>{fieldItem.groupInput.value}</>
            )}
          </span>
        </div>
      )}
      {children}
      {fieldItem.groupInput.position === 'end' && (
        <div className="input-group-append">
          <span className="input-group-text">
            {fieldItem.groupInput.type === 'icon' ? (
              <i className={fieldItem.groupInput.value}></i>
            ) : (
              <>{fieldItem.groupInput.value}</>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export default InputGroup
