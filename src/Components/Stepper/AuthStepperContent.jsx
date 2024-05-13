import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GetAuthModule } from "../../Services/AuthService"
import { SetActiveGroup } from "../../Services/UserService"
import classNames from "classnames"
import { setPhotoProfile, setUser } from "../../Store/User/userSlice"
import { SkeletonAuth } from "../AutoLayout/Skeleton"
import Stepper from "react-stepper-horizontal"
import { useNavigate } from "react-router-dom"

function AuthStepperContent() {
  const dispatch = useDispatch()
  // state
  const user = useSelector((state) => state.user)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedModule, setSelectedModule] = useState({})
  const [selectedRole, setSelectedRole] = useState({})
  // redux
  const userData = useSelector((state) => state.user.data)
  const navigate = useNavigate()
  const devMode = useSelector((state) => state.devMode)

  const handleSelectedGroup = async (
    userId,
    roleId,
    roleDescr,
    moduleId,
    moduleDescr,
  ) => {
    await SetActiveGroup({ userId, moduleId, roleId })
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data)
          dispatch(
            setUser({
              userId,
              activeModule: { id: moduleId, desc: moduleDescr },
              activeRole: { id: roleId, desc: roleDescr },
            }),
          )
          dispatch(setPhotoProfile(res.data.photoProfile))
          if (window.location.pathname === "/auth") {
            if (devMode) {
              navigate("/dashboard")
            } else {
              window.location = "/dashboard"
            }
          }
          window.$("#authStepperModal").modal("hide")
        }
      })
      .catch((e) => {
        // console.log(e)
        window.Swal.fire("Error", e.message, "error")
      })
  }

  const handleSelectModule = (data) => {
    setSelectedModule(data)
    if (data.role.length === 1) {
      handleSelectedGroup(
        user.id,
        data.role[0].groupId,
        data.role[0].groupName,
        data.id,
        data.name,
      )
    }
    setActiveStep(1)
  }

  useEffect(() => {
    const userModule = userData?.data?.module || []
    if (userModule.length === 1) {
      handleSelectModule(userModule[0])
    }
  }, [userData])

  return (
    <>
      <div className="mb-3">
        <Stepper
          steps={[{ title: "Pilih Modul" }, { title: "Pilih Jabatan" }]}
          activeStep={activeStep}
          activeColor="#5cb85c"
          completeColor="#c0c0c0"
        />
      </div>
      {userData?.data?.module.length <= 0 && <SkeletonAuth />}
      <div>
        {activeStep === 0 && (
          <section>
            <div className="row">
              {userData?.data?.module?.map((data) => (
                <div className="col my-2" key={data.id}>
                  <button
                    onClick={() => handleSelectModule(data)}
                    className={classNames(
                      "btn-select-module btn btn-default w-100 h-100",
                      // {
                      //   "btn-success": data.id != user.activeModule.id,
                      //   "btn-default": data.id == user.activeModule.id,
                      // },
                    )}
                  >
                    {/* <span className="badge badge-danger navbar-badge position-absolute text-lg">
                      {data.totalTaskList}
                    </span> */}
                    <i
                      className={`${data.icon} mb-1`}
                      style={{ fontSize: 24 }}
                    ></i>
                    <div>{data.name}</div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeStep === 1 && (
          <div>
            <div className="d-flex flex-wrap overflow-y-scroll">
              {selectedModule.role &&
                selectedModule.role.map((role, index) => {
                  // if (role.active != "1") return null
                  return (
                    <div className="col-6 col-md-2 my-2" key={index}>
                      <button
                        onClick={() => {
                          if (role.active != "1")
                            window.Swal.fire(
                              "Peringatan",
                              "Pilih Role Aktif",
                              "warning",
                            )
                          else
                            handleSelectedGroup(
                              user.id,
                              role.groupId,
                              role.groupName,
                              selectedModule.id,
                              selectedModule.name,
                            )
                        }}
                        className={classNames("btn w-100 h-100 btn-default", {
                          "bg-success": role.active == "1",
                        })}
                        disabled={role.active != "1"}
                      >
                        {/* <span className="badge badge-danger text-lg">
                          {role.totalTaskList}
                        </span> */}
                        {/* <i
                          className="fal fa-user mb-1"
                          style={{ fontSize: 24 }}
                        ></i> */}
                        <img src={role.icon} className="w-75" />
                        <div>{role.groupName}</div>
                      </button>
                    </div>
                  )
                })}
            </div>
            <div className="row">
              <div className="col mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={() => setActiveStep(0)}
                >
                  <i className="fal fa-arrow-left"></i>
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AuthStepperContent
