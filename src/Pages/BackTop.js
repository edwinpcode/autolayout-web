import React, { useState, useEffect } from "react"

const BackTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", () => {
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
      behavior: "smooth",
    })
  }

  const assistant = () => {
    const va = document.getElementById("assistant")
    if (va) {
      va.classList.toggle("d-none")
    }
  }

  return (
    <div className="back-to-top" id="back-to-top">
      <div className="d-flex align-items-center">
        <div>
          {showTopBtn && (
            <button
              onClick={goToTop}
              className="btn btn-success"
              role="button"
              aria-label="Scroll to top"
            >
              <span className="fas fa-chevron-up"></span>
            </button>
          )}
        </div>
        <div>
          <img
            className="cursor-pointer"
            src="images/assistant/ask_me_4.gif"
            style={{
              height: "120px",
              width: "120px",
            }}
            onClick={assistant}
          ></img>
        </div>
      </div>
    </div>
  )
}
export default BackTop
