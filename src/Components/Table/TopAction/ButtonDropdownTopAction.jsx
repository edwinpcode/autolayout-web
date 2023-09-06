function ButtonDropdownTopAction({ label, item, icon, ...props }) {
  return (
    <div className="dropdown">
      <button
        type="button"
        data-toggle="dropdown"
        aria-expanded="false"
        {...props}
      >
        <i className={icon}></i>
        <span>{label}</span>
      </button>
      <div className="dropdown-menu dropdown-menu-right">
        {item.map((item, index) => (
          <a key={index} className="dropdown-item" href="#">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default ButtonDropdownTopAction
