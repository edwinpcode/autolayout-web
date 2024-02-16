import React, { useState } from "react"
import { SetActiveGroup } from "../Services/UserService"
import classNames from "classnames"
import { useDispatch, useSelector } from "react-redux"
import Stepper from "react-stepper-horizontal"
import { setPhotoProfile, setUser } from "../Store/User/userSlice"

const Modul = ({ step }) => {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user.id)
  const module = useSelector((state) => state.module)
  const activeModuleId = useSelector((state) => state.user.activeModule.id)
  const activeRoleId = useSelector((state) => state.user.activeRole.id)
  const moduleId = useSelector((state) => state.user.activeModule.id)
  const roleId = useSelector((state) => state.user.activeRole.id)
  const [activeStep, setActiveStep] = useState(step || 0)
  const [selectedModule, setSelectedModule] = useState({})
  const [selectedRole, setSelectedRole] = useState({})
  const [loading, setloading] = useState(false)

  const handleSelectModule = (data) => {
    setSelectedModule(data)
    setActiveStep(1)
  }

  const handleSelectedGroup = async (
    userId,
    roleId,
    roleDescr,
    moduleId,
    moduleDescr,
  ) => {
    setloading(true)
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
          window.location.reload()
          window.$("#authStepperModal").modal("hide")
        }
      })
      .catch((e) => {
        console.log(e)
        window.Swal.fire("Error", e.message, "error")
      })
      .finally(() => {
        setloading(false)
      })
  }
  return (
    <div>
      <div className="mb-3">
        <Stepper
          steps={[{ title: "Pilih Modul" }, { title: "Pilih Jabatan" }]}
          activeStep={activeStep}
          activeColor="#5cb85c"
          completeColor="#c0c0c0"
        />
      </div>
      {!module.length && <span>Loading...</span>}
      <div>
        {activeStep === 0 && (
          <section>
            <div className="row">
              {module.map((data) => (
                <div className="col my-2" key={data.id}>
                  <button
                    onClick={() => handleSelectModule(data)}
                    className={classNames(
                      "btn-select-module btn btn-success w-100 h-100",
                      {
                        "btn-success": data.id != activeModuleId,
                        "btn-default": data.id == activeModuleId,
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
        {!loading && activeStep === 1 && (
          <section>
            <div className="row">
              {selectedModule.role &&
                selectedModule.role.map((role, index) => (
                  <div className="col my-2" key={index}>
                    <button
                      onClick={() =>
                        handleSelectedGroup(
                          userId,
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
        {loading && <span className="text-sx">Loading...</span>}
      </div>
    </div>
  )
}

export default Modul
