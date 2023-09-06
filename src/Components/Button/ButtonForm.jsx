import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { axiosPost } from '../../Services/AutoLayoutService'
import { setFormPanel } from '../../Store/Form/FormSlice'

function ButtonForm({ fieldItem }) {
  const dispatch = useDispatch()
  const { state } = useLocation()
  // redux
  const menu = useSelector((state) => state.menu)
  const userId = useSelector((state) => state.user.id)

  const handleButtonClick = async () => {
    const payload = {
      tabId: [],
      tc: menu.activeTrackId,
      userId: userId,
      param: state.param,
    }
    // push tab id
    payload.tabId.push(menu.activeTabId)
    // push button id
    payload.tabId.push(fieldItem.id)
    // get product panel
    await axiosPost('/getfieldbyformnameproduct', payload).then((res) => {
      if (res.data.status !== '1') {
        return window.Swal.fire('', res.data.message, 'error')
      }
      dispatch(setFormPanel(res.data.panel))
      window.$('.modal').modal('hide')
    })
  }

  return (
    <button
      type="button"
      className="btn btn-danger"
      onClick={() => handleButtonClick()}
    >
      {fieldItem.label}
    </button>
  )
}

export default ButtonForm
