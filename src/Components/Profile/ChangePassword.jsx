import { ErrorMessage } from '@hookform/error-message'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { encryptAES } from '../../Utils/EncryptUtils'
import { changePassword } from '../../Services/AuthService'
import { useState } from 'react'

function ChangePassword() {
  // prettier-ignore
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })
  const [hiddenPassword, setHiddenPassword] = useState(true)
  const [hiddenPasswordNew, setHiddenPasswordNew] = useState(true)
  const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(true)
  // redux
  const user = useSelector((state) => state.user)

  const handleChangePassword = async ({
    oldPassword,
    newPassword,
    confirmPassword,
  }) => {
    // const secretKey = moment().locale('en').format('dddYYYYMMDD')

    const encryptedPassword = encryptAES(oldPassword)
    const encryptedNewPassword = encryptAES(newPassword)
    const encryptedConfirmPassword = encryptAES(confirmPassword)

    const payload = {
      type: 'change',
      userid: user.id,
      password: encryptedPassword,
      newpwd: encryptedNewPassword,
      repassword: encryptedConfirmPassword,
    }
    changePassword(payload)
      .then((res) => {
        if (res.data.status == '0') {
          throw new Error(res.data.message)
        }
        reset()
        window.Swal.fire('Sucess', res.data.message, 'success')
      })
      .catch((error) => {
        window.Swal.fire('Error', error.message, 'error')
      })
  }

  const validatePasswordMatch = (value) => {
    // get the value of the "password" field using the watch function
    const newPassword = watch('newPassword')
    // compare the value with the value of the "password" field
    return value === newPassword ? true : 'Kata sandi tidak cocok'
  }

  return (
    <div className="card w-100 card-danger" id="changePassword">
      <div className="card-header">
        <h3 className="card-title">Ganti Kata Sandi</h3>
        <div className="card-tools m-0">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label>
                Kata Sandi Saat Ini
                <span className="text-danger font-weight-bold"> *</span>
              </label>
              <div className="input-group">
                <input
                  type={hiddenPassword ? 'password' : 'text'}
                  id="oldPassword"
                  className="form-control form-control-sm"
                  name="oldPassword"
                  {...register('oldPassword', {
                    required: 'Kata Sandi Saat Ini harus diisi',
                    minLength: {
                      value: 8,
                      message: 'Minimal Kata Sandi Saat Ini 8 karakter',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Maksimal Kata Sandi Saat Ini 30 karakter',
                    },
                  })}
                />
                <div
                  className="input-group-append"
                  onClick={() => setHiddenPassword((value) => !value)}
                >
                  <span className="input-group-text">
                    {hiddenPassword ? (
                      <i className="far fa-eye text-secondary" />
                    ) : (
                      <i className="far fa-eye-slash text-secondary" />
                    )}
                  </span>
                </div>
              </div>
              <ErrorMessage
                errors={errors}
                name="oldPassword"
                as="div"
                style={{ color: 'red', marginTop: '5px' }}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label>
                Kata Sandi Baru
                <span className="text-danger font-weight-bold"> *</span>
              </label>
              <div className="input-group">
                <input
                  type={hiddenPasswordNew ? 'password' : 'text'}
                  id="newPassword"
                  className="form-control form-control-sm"
                  name="newPassword"
                  {...register('newPassword', {
                    required: 'Kata Sandi Baru harus diisi',
                    minLength: {
                      value: 8,
                      message: 'Minimal Kata Sandi Baru 8 karakter',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Maksimal Kata Sandi Baru 30 karakter',
                    },
                  })}
                />
                <div
                  className="input-group-append"
                  onClick={() => setHiddenPasswordNew((value) => !value)}
                >
                  <span className="input-group-text">
                    {hiddenPasswordNew ? (
                      <i className="far fa-eye text-secondary" />
                    ) : (
                      <i className="far fa-eye-slash text-secondary" />
                    )}
                  </span>
                </div>
              </div>
              <ErrorMessage
                errors={errors}
                name="newPassword"
                as="div"
                style={{ color: 'red', marginTop: '5px' }}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label>
                Konfirmasi Kata Sandi Baru
                <span className="text-danger font-weight-bold"> *</span>
              </label>
              <div className="input-group">
                <input
                  type={hiddenPasswordConfirm ? 'password' : 'text'}
                  id="confirmPassword"
                  className="form-control form-control-sm"
                  name="confirmPassword"
                  {...register('confirmPassword', {
                    required: 'Konfirmasi Kata Sandi Baru harus diisi',
                    minLength: {
                      value: 8,
                      message: 'Minimal Konfirmasi Kata Sandi Baru 8 karakter',
                    },
                    maxLength: {
                      value: 30,
                      message:
                        'Maksimal Konfirmasi Kata Sandi Baru 30 karakter',
                    },
                    validate: validatePasswordMatch,
                  })}
                />
                <div
                  className="input-group-append"
                  onClick={() => setHiddenPasswordConfirm((value) => !value)}
                >
                  <span className="input-group-text">
                    {hiddenPasswordConfirm ? (
                      <i className="far fa-eye text-secondary" />
                    ) : (
                      <i className="far fa-eye-slash text-secondary" />
                    )}
                  </span>
                </div>
              </div>
              <ErrorMessage
                errors={errors}
                name="confirmPassword"
                as="div"
                style={{ color: 'red', marginTop: '5px' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-sm btn-danger"
          type="button"
          onClick={handleSubmit(handleChangePassword)}
        >
          Simpan
        </button>
        <button className="btn btn-sm btn-secondary" onClick={() => reset()}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default ChangePassword
