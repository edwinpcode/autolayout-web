import dataSeries from './series.json'
import dataDrilldown from './drilldown.json'

export const dataColumn = {
  chart: {
    type: 'column',
  },
  title: {
    align: 'left',
    text: 'Browser market shares. January, 2022',
  },
  subtitle: {
    align: 'left',
    text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
  },
  accessibility: {
    announceNewData: {
      enabled: true,
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    title: {
      text: 'Total percent market share',
    },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        format: '{point.name}: {point.y:.1f}%',
      },
    },
    
  },

  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
  },
  series: [dataSeries],
  drilldown: dataDrilldown,
}
