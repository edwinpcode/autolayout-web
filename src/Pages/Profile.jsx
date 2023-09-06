import EditPhoto from '../Components/Profile/EditPhoto'
import ChangePassword from '../Components/Profile/ChangePassword'

function Profile() {
  return (
    <div className="row">
      <div className="col-md-6">
        <EditPhoto />
      </div>
      <div className="col-md-6">
        <ChangePassword />
      </div>
    </div>
  )
}

export default Profile
