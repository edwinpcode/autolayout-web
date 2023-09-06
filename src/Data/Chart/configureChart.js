import dataSeries from './series.json'
import dataDrilldown from './drilldown.json'

export const configureChart = {
  chart: {
    type: '',
  },
  title: {
    align: 'left',
    text: '',
  },
  subtitle: {
    align: 'left',
    text: '',
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
      text: '',
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
    pie: {},
  },

  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
  },
  series: [dataSeries],
  drilldown: dataDrilldown,
}
