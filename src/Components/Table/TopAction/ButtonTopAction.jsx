import { useNavigate } from 'react-router-dom'

function ButtonTopAction({ className, item }) {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    // handle redirect
    if (item?.isRedirect == '1') {
      navigate(item?.url?.path, {
        state: {
          param: [''],
          paramValue: '',
        },
      })
    }
  }

  return (
    <button className={className} onClick={handleButtonClick}>
      <i className={item?.icon}></i>
      <span>{item?.label}</span>
    </button>
  )
}

export default ButtonTopAction
