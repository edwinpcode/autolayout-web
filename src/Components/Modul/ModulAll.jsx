import React, { useState } from "react"
import { SetActiveGroup } from "Services/UserService"
import { useDispatch, useSelector } from "react-redux"
import { setPhotoProfile, setUser } from "Store/User/userSlice"

const ModulAll = ({ className }) => {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user.id)
  const module = useSelector((state) => state.module)
  const moduleId = useSelector((state) => state.user.activeModule.id)
  const moduleDesc = useSelector((state) => state.user.activeModule.desc)
  const roleId = useSelector((state) => state.user.activeRole.id)
  const roleDesc = useSelector((state) => state.user.activeRole.desc)
  const [loading, setloading] = useState(false)

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
        // console.log(e)
        window.Swal.fire("Error", e.message, "error")
      })
      .finally(() => {
        setloading(false)
      })
  }
  return (
    <div className={`${className}`}>
      {!module.length && <span>Loading...</span>}
      <div>
        <div className="text-bold">
          Aktif: {moduleDesc} - {roleDesc}
        </div>
        <div className="row mt-3">
          {module.map((data, index) => (
            <div key={data.id + "_" + index} id={data.id} className="col">
              {data.role.length ? (
                <div className="border-bottom">
                  <div className="text-bold">{data.name}</div>
                </div>
              ) : null}
              <div className="row">
                {data.role.map((role, i) => (
                  <div
                    className="col-md-2 col-6 my-2"
                    key={role.id + "_" + i}
                    id={role.id}
                  >
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
                            userId,
                            role.groupId,
                            role.groupName,
                            data.id,
                            data.name,
                          )
                      }}
                      className={`btn h-100 ${
                        roleId == role.groupId && data.id == moduleId
                          ? "btn-success"
                          : "btn-default"
                      }`}
                      disabled={role.active != "1"}
                    >
                      {/* <i
                        className="fal fa-user mb-1"
                        style={{ fontSize: 24 }}
                      ></i> */}
                      <img src={role.icon} className="w-75 " />
                      <div>{role.groupName}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {loading && <span className="text-sx">Loading...</span>}
      </div>
    </div>
  )
}

export default ModulAll
