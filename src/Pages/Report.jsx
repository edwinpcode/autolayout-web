import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Tab from '../Components/AutoLayout/Tab'
import TableList from './TableList'
import { axiosPost } from '../Services/AutoLayoutService'
import { useSelector } from 'react-redux'

const tab = [
  { id: 'chart', label: 'Chart' },
  { id: 'table', label: 'Table' },
]

function Report() {
  const [options, setOptions] = useState({
    credits: {
      enabled: false,
      href: '',
      text: '',
    },
  })
  const [activeTabId, setActiveTabId] = useState('chart')
  // redux
  const user = useSelector((state) => state.user)
  const menu = useSelector((state) => state.menu)

  const getChartOption = async () => {
    const payload = {
      userId: user.id,
      menuId: menu.activeMenuId,
      moduleId: user.activeModule.id,
      roleId: user.activeRole.id,
    }
    await axiosPost('/reportchart', payload).then((res) =>
      setOptions({
        credits: {
          enabled: false,
          href: '',
          text: '',
        },
        ...res.data.data,
      })
    )
  }

  useEffect(() => {
    getChartOption()
  }, [])

  return (
    <div>
      <div className="mb-3">
        <Tab
          data={tab}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />
      </div>
      {activeTabId === 'chart' ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <TableList />
      )}
    </div>
  )
}

export default Report
