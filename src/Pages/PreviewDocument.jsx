function PreviewDocument() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const src = urlParams.get('src')

  return (
    <embed
      src={src}
      type="application/pdf"
      width="100%"
      style={{ height: '100vh', overflow: 'hidden' }}
    />
  )
}

export default PreviewDocument
