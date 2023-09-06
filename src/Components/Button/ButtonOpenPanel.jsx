import { useDispatch, useSelector } from 'react-redux'
import { getFieldBySub } from '../../Services/AutoLayoutService'
import {
  setFormAction,
  setFormLastPayload,
  setFormPanel,
} from '../../Store/Form/FormSlice'
import { setLoadingField } from '../../Store/Loading/LoadingSlice'
import { handleParamValues } from '../../Utils/ParamUtils'

function ButtonOpenPanel({ headerItem, info, getValues }) {
  const dispatch = useDispatch()
  // redux
  const userId = useSelector((state) => state.user.id)
  const menu = useSelector((state) => state.menu)

  const handleOnClick = async () => {
    dispatch(setLoadingField(true))
    dispatch(setFormPanel([]))
    dispatch(setFormAction([]))
    // set payload
    const payload = {
      tabId: menu.activeTabId,
      tc: menu.activeTrackId,
      isNew: headerItem.isNew || '0',
      userId: userId,
      flagType: headerItem.flagType,
      flagAction: headerItem.flagAction,
      param: handleParamValues(headerItem.url.param, getValues, info),
    }
    dispatch(setFormLastPayload(payload))
    // hit endpoint
    await getFieldBySub(payload).then((res) => {
      if (res.data.status !== '1') {
        return window.Swal.fire('', res.data.message, 'error')
      }
      dispatch(setFormPanel(res.data.panel))
      dispatch(setFormAction(res.data.action))
      dispatch(setLoadingField(false))
    })

    // if (headerItem.openPanel?.length) {
    //   const listPanel = window.$('.panel')
    //   listPanel?.each(function () {
    //     if (headerItem.openPanel.includes(this.id)) {
    //       window.$('#' + this.id).CardWidget('expand')
    //     } else {
    //       window.$('#' + this.id).CardWidget('collapse')
    //     }
    //   })
    // }
  }

  return (
    <button
      className={headerItem.className}
      type="button"
      onClick={handleOnClick}
    >
      <i className={headerItem.icon}></i>
      <span>{headerItem.label}</span>
    </button>
  )
}

export default ButtonOpenPanel
