import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { setFormPanel } from '../../Store/Form/FormSlice'
import { resetHiddenField } from '../../Store/HiddenElement/hiddenElementSlice'
import { setTabId } from '../../Store/Menu/menuSlice'
import { useLocation } from 'react-router-dom'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'

export default function Tabw({ data, activeTabId, setActiveTabId, reset }) {
  const { state } = useLocation()
  const dispatch = useDispatch()
  const [value, setValue] = React.useState(0)
  const loading = useSelector((state) => state.loading.field)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <Box sx={{ borderBottom: '1px solid #DEE2E6' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: {
              backgroundColor: '#17A2B8',
              height: '3px',
            },
          }}
        >
          {data?.map((item, index) => (
            <Tab
              key={item.id}
              id={item.id}
              style={{
                display:
                  index > 0 && state?.param.length === 0 ? 'none' : 'block',
                color: loading ? 'GrayText' : '#17a2b8',
                fontFamily: 'SourceSansPro',
                textTransform: 'capitalize',
                fontWeight: 'reguler',
              }}
              label={item.label}
              icon={
                item.checked ? (
                  item.checked == '1' ? (
                    <CheckBox />
                  ) : (
                    <CheckBoxOutlineBlank />
                  )
                ) : null
              }
              onClick={() => {
                reset && reset()
                if (activeTabId !== item.id) {
                  dispatch(setFormPanel([]))
                  dispatch(resetHiddenField())
                }
                dispatch(setTabId(item.id))
                setActiveTabId(item.id)
              }}
              disabled={loading}
            ></Tab>
          ))}
        </Tabs>
      </Box>
    </div>
  )
}
