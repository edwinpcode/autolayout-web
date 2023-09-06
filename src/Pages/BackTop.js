import React, { useState, useEffect } from 'react'

const BackTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true)
      } else {
        setShowTopBtn(false)
      }
    })
  }, [])

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      {showTopBtn && (
        <button
          id="back-to-top"
          onClick={goToTop}
          className="btn btn-danger back-to-top"
          role="button"
          aria-label="Scroll to top"
        >
          <span className="fas fa-chevron-up"></span>
        </button>
      )}
      {''}
    </div>
  )
}
export default BackTop
