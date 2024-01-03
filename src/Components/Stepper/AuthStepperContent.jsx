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
        console.log(e)
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
          steps={[{ title: "Select Application" }, { title: "Select Role" }]}
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
                      "btn-select-module btn btn-success w-100 h-100",
                      {
                        "btn-success": data.id != user.activeModule.id,
                        "btn-default": data.id == user.activeModule.id,
                      },
                    )}
                  >
                    <span className="badge badge-danger navbar-badge position-absolute text-lg">
                      {data.totalTaskList}
                    </span>
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
          <section>
            <div className="row">
              {selectedModule.role &&
                selectedModule.role.map((role, index) => (
                  <div className="col my-2" key={index}>
                    <button
                      onClick={() =>
                        handleSelectedGroup(
                          user.id,
                          role.groupId,
                          role.groupName,
                          selectedModule.id,
                          selectedModule.name,
                        )
                      }
                      className={classNames("btn w-100 h-100", {
                        "btn-success": selectedRole != role,
                        "btn-default": selectedRole == role,
                      })}
                    >
                      <span className="badge badge-danger navbar-badge position-absolute text-lg">
                        {role.totalTaskList}
                      </span>
                      <i
                        className="fal fa-user mb-1"
                        style={{ fontSize: 24 }}
                      ></i>
                      <div>{role.groupName}</div>
                    </button>
                  </div>
                ))}
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
          </section>
        )}
      </div>
    </>
  )
}

export default AuthStepperContent
