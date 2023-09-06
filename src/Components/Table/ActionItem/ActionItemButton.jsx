import { useNavigate } from 'react-router-dom'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils'
import { saveAs } from 'file-saver'
import APIClient from '../../../Services/APIClient'
import { deleteData } from '../../../Services/AutoLayoutService'
import { confirmSwal } from '../../../Utils/SwalUtils'
import { handleGetGridData } from '../../../Utils/TableUtils'
import { useSelector } from 'react-redux'

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback)
}

function ActionItemButton({
  info,
  headerItem,
  gridItem,
  buttonClass,
  icon,
  setDataQuery,
}) {
  const navigate = useNavigate()
  const activeTrackId = useSelector((state) => state.menu.activeTrackId)

  const handleButtonClick = async () => {
    const payload = { param: [] }
    headerItem?.url?.param?.forEach((paramId) => {
      const paramValue = info.row.original[paramId]
      payload.param.push({ id: paramId, value: paramValue })
    })

    // handle redirect
    if (headerItem?.isRedirect == '1') {
      return navigate(headerItem?.url?.path, { state: payload })
    }

    if (headerItem?.flagType === 'delete') {
      // set flag to paylod
      Object.assign(payload, { flagType: headerItem.flagType })
      Object.assign(payload, { flagAction: headerItem.flagAction })
      // delete action
      await deleteData(payload).then((res) => {
        if (res.data.status != '1') {
          return window.Swal.fire('', res.data.message, 'error')
        }
        window.Swal.fire('', res.data.message, 'success')
      })
      // refresh grid data
      const gridPayload = {
        grid: gridItem.id,
        param: [],
        pagination: { pageIndex: 1, perPage: 10 },
        tc: activeTrackId,
      }
      gridItem.reference.parent.forEach((parentId) => {
        const parentValue = window.$('#' + parentId).val()
        gridPayload.param.push({ id: parentId, value: parentValue })
      })
      await handleGetGridData(gridPayload, setDataQuery)
    }

    if (headerItem?.flagType === 'export') {
      // set flag to paylod
      Object.assign(payload, { flag: headerItem.flagAction })
      const documentData = await APIClient.post('/gendocument', payload).then(
        (res) => res.data
      )
      loadFile('/Data/sample_dokumen.docx', function (error, content) {
        if (error) {
          throw error
        }
        var zip = new PizZip(content)
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        })
        doc.setData(documentData.data)
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function (
                error,
                key
              ) {
                error[key] = value[key]
                return error
              },
              {})
            }
            return value
          }
          console.log(JSON.stringify({ error: error }, replaceErrors))

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation
              })
              .join('\n')
            console.log('errorMessages', errorMessages)
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error
        }
        var out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }) //Output the document using Data-URI
        saveAs(out, documentData.filename)
      })
    }
  }

  const confirmButtonClick = () => {
    // console.log(headerItem)
    // handle need confirm
    if (headerItem?.needConfirm == '1') confirmSwal(handleButtonClick)
    else handleButtonClick()
  }

  return (
    <>
      {headerItem.type === 'button' && (
        <button
          type="button"
          className={`btn btn-xs ${buttonClass} order-${headerItem?.property?.order}`}
          onClick={confirmButtonClick}
        >
          <i className={icon}></i>
          <small>{headerItem?.label}</small>
        </button>
      )}
      {headerItem.type === 'anchor' && (
        <div className="mx-auto">
          <button
            type="button"
            onClick={confirmButtonClick}
            className="btn btn-xs btn-link"
          >
            {headerItem.label}
          </button>
        </div>
      )}
    </>
  )
}

export default ActionItemButton
