import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import Panel from "../AutoLayout/Panel"
import FieldType from "../AutoLayout/FieldType"
import { SkeletonModal } from "../AutoLayout/Skeleton"
import ButtonType from "../AutoLayout/ButtonType"
import FieldWithPanel from "../AutoLayout/FieldWithPanel"

function ModalWithButton({
  buttonItem,
  actionList,
  dataTarget,
  gridItem,
  setFilterData,
  setDataQuery,
  loading,
  pageSize = 10,
  pageIndex = 0,
  fetchData = () => {},
  setAutoOpenFirstItem,
  data,
  ...props
}) {
  // prettier-ignore
  const { register, control, handleSubmit, formState: { errors }, setValue, resetField, getValues, watch, unregister, clearErrors } = useForm({ mode: 'onChange' })

  // fltering from redux
  const filter = useSelector((state) => state.list.filtering)

  // useEffect(() => {
  //   if (data) {
  //     console.log(data)
  //   }
  // }, [data])

  return (
    <>
      <div
        className="modal fade"
        id={`${dataTarget}_${buttonItem.id}`}
        aria-hidden="true"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`modalLabel_${buttonItem.id}`}>
                {buttonItem.label}
              </h5>
              <button
                type="button"
                className="close"
                onClick={() => {
                  window.$(".modal").modal("hide")
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form>
              <div className="modal-body ml-2 mr-2">
                {loading && <SkeletonModal />}
                <div className="row">
                  {/* non panel */}
                  {data?.data &&
                    data.data.map((fieldItem) => (
                      <FieldType
                        key={fieldItem.id}
                        fieldItem={fieldItem}
                        data={data.data}
                        register={register}
                        getValues={getValues}
                        setValue={setValue}
                        resetField={resetField}
                        errors={errors}
                        control={control}
                        watch={watch}
                        unregister={unregister}
                        filter={filter}
                        setFilterData={setFilterData}
                      />
                    ))}
                  {/* if has panel */}
                  {data?.panel?.length > 0 && (
                    <FieldWithPanel
                      panelData={data.panel}
                      register={register}
                      handleSubmit={handleSubmit}
                      unregister={unregister}
                      setValue={setValue}
                      getValues={getValues}
                      clearErrors={clearErrors}
                      errors={errors}
                      resetField={resetField}
                      watch={watch}
                      control={control}
                    />
                  )}
                  {/* view document */}
                  {data?.data?.ext === ".pdf" ? (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className="fas fa-file-pdf"
                        style={{
                          fontSize: 100,
                          margin: "10px 5px",
                          color: "#b30b00",
                        }}
                      ></i>
                      <h5>{data.data.docDesc}</h5>
                    </div>
                  ) : data?.data?.ext === ".doc" ? (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className="fas fa-file-word"
                        style={{
                          fontSize: 100,
                          margin: "10px 5px",
                          color: "#2b5796",
                        }}
                      ></i>
                      <h5>{data.data.docDesc}</h5>
                    </div>
                  ) : data?.data?.ext === ".docx" ? (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className="fas fa-file-word"
                        style={{
                          fontSize: 100,
                          margin: "10px 5px",
                          color: "#2b5796",
                        }}
                      ></i>
                      <h5>{data.data.docDesc}</h5>
                    </div>
                  ) : data?.data?.ext === ".xls" ? (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className="fas fa-file-excel"
                        style={{
                          fontSize: 100,
                          margin: "10px 5px",
                          color: "#01723a",
                        }}
                      ></i>
                      <h5>{data.data.docDesc}</h5>
                    </div>
                  ) : data?.data?.ext === ".xlsx" ? (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className="fas fa-file-excel"
                        style={{
                          fontSize: 100,
                          margin: "10px 5px",
                          color: "#01723a",
                        }}
                      ></i>
                      <h5>{data.data.docDesc}</h5>
                    </div>
                  ) : data?.data?.ext === ".csv" ? (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className="fas fa-file-csv"
                        style={{
                          fontSize: 100,
                          margin: "10px 5px",
                          color: "#01723a",
                        }}
                      ></i>
                      <h5>{data.data.docDesc}</h5>
                    </div>
                  ) : data?.data?.ext === ".txt" ? (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className="fas fa-file-alt"
                        style={{
                          fontSize: 100,
                          margin: "10px 5px",
                        }}
                      ></i>
                      <h5>{data.data.docDesc}</h5>
                    </div>
                  ) : data?.data?.ext === ".png" ? (
                    <>
                      {data?.data?.result && (
                        <div
                          style={{
                            textAlign: "center",
                            margin: "0 auto",
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${data.data.result}`}
                            alt=""
                            className="img-fluid"
                            style={{
                              width: "100%",
                              marginBottom: 10,
                            }}
                          />
                          <h5>{data.data.docDesc}</h5>
                        </div>
                      )}
                    </>
                  ) : data?.data?.ext === ".jpg" ? (
                    <>
                      {data?.data?.result && (
                        <div
                          style={{
                            textAlign: "center",
                            margin: "0 auto",
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${data.data.result}`}
                            alt=""
                            className="img-fluid"
                            style={{
                              width: "100%",
                              marginBottom: 10,
                            }}
                          />
                          <h5>{data.data.docDesc}</h5>
                        </div>
                      )}
                    </>
                  ) : data?.data?.ext === ".jpeg" ? (
                    <>
                      {data?.data?.result && (
                        <div
                          style={{
                            textAlign: "center",
                            margin: "0 auto",
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${data.data.result}`}
                            alt=""
                            className="img-fluid"
                            style={{
                              width: "100%",
                              marginBottom: 10,
                            }}
                          />
                          <h5>{data.data.docDesc}</h5>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {data?.data?.result && (
                        <div
                          style={{
                            textAlign: "center",
                            margin: "0 auto",
                          }}
                        >
                          <i
                            className="fas fa-file"
                            style={{
                              fontSize: 100,
                              marginBottom: 10,
                            }}
                          ></i>
                          <h5>{data.data.docDesc}</h5>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                {actionList?.map((actionItem, index) => (
                  <ButtonType
                    key={index}
                    buttonItem={actionItem}
                    handleSubmit={handleSubmit}
                    getValues={getValues}
                    gridItem={gridItem}
                    setFilterData={setFilterData}
                    setDataQuery={setDataQuery}
                    panelList={data.panel || [{ listField: data }]}
                    saveEndpoint="/savedatamodal"
                    fetchData={fetchData}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    setAutoOpenFirstItem={setAutoOpenFirstItem}
                  />
                ))}
                {data?.data?.ext === ".pdf" ? (
                  <div>
                    <a
                      className="btn btn-sm btn-danger"
                      download={data.data.docDesc}
                      href={`data:application/pdf;base64,${data.data.result}`}
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                  </div>
                ) : data?.data?.ext === ".doc" ? (
                  <div>
                    <a
                      className="btn btn-sm btn-danger"
                      download={data.data.docDesc}
                      href={`data:application/msword;base64,${data.data.result}`}
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                  </div>
                ) : data?.data?.ext === ".docx" ? (
                  <div>
                    <a
                      className="btn btn-sm btn-danger"
                      download={data.data.docDesc}
                      href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.data.result}`}
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                  </div>
                ) : data?.data?.ext === ".xls" ? (
                  <div>
                    <a
                      className="btn btn-sm btn-danger"
                      download={data.data.docDesc}
                      href={`data:application/vnd.ms-excel;base64,${data.data.result}`}
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                  </div>
                ) : data?.data?.ext === ".xlsx" ? (
                  <div>
                    <a
                      className="btn btn-sm btn-danger"
                      download={data.data.docDesc}
                      href={`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8;base64,${data.data.result}`}
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                  </div>
                ) : data?.data?.ext === ".csv" ? (
                  <div>
                    <a
                      className="btn btn-sm btn-danger"
                      download={data.data.docDesc}
                      href={`data:text/csv;base64,${data.data.result}`}
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                  </div>
                ) : data?.data?.ext === ".txt" ? (
                  <div>
                    <a
                      className="btn btn-sm btn-danger"
                      download={data.data.docDesc}
                      href={`data:text/plain;base64,${data.data.result}`}
                    >
                      <i className="fas fa-arrow-down"></i> Download
                    </a>
                  </div>
                ) : (
                  <>
                    {data?.data?.result && (
                      <div>
                        <a
                          className="btn btn-sm btn-danger"
                          download={data.data.docDesc}
                          href={`data:image/png;base64,${data.data.result}`}
                        >
                          <i className="fas fa-arrow-down"></i> Download
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalWithButton
