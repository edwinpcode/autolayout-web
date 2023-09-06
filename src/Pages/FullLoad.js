import React from 'react'
import LoadSpin from './Loading'
import { useState } from 'react'

const FullLoad = () => {
  const [loading, setLoading] = useState(false)
  return [
    loading ? <LoadSpin /> : null,
    () => setLoading(true),
    () => setLoading(false),
  ]
}

export default FullLoad
