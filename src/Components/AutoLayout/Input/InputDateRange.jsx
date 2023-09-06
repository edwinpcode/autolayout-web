function InputDateRange({ label, id, register }) {
  window.$(function () {
    window.$(`#dateRange_${id}`).daterangepicker({
      autoUpdateInput: false,
      locale: {
        cancelLabel: 'Clear',
        format: 'DD MMMM YYYY',
      },
    })
    // on apply
    window
      .$(`#dateRange_${id}`)
      .on('apply.daterangepicker', function (ev, picker) {
        window
          .$(this)
          .val(
            picker.startDate.format('DD MMMM YYYY') +
              ' - ' +
              picker.endDate.format('DD MMMM YYYY')
          )
          .focus()
        window.$('.daterangepicker').hide()
      })
    // on cancel
    window
      .$(`#dateRange_${id}`)
      .on('cancel.daterangepicker', function (ev, picker) {
        window.$(this).val('')
      })
  })
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="far fa-calendar-alt"></i>
          </span>
        </div>
        <input
          {...register(id)}
          type="text"
          className="form-control float-right"
          id={`dateRange_${id}`}
          autoComplete="off"
        />
      </div>
    </div>
  )
}

export default InputDateRange
