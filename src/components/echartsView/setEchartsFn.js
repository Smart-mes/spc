export default {
  customXbaxValue (xbaxObj) {
    const option = JSON.parse(xbaxObj.option)
    const { title, xAxis, yAxis, series: [seriesItem] } = option
    const { modelCode, dataindex, yName, max, min, cl, ucl, lcl, data, problemData } = xbaxObj

    title.text = title.text || `[${modelCode} 控制图]`
    xAxis.data = dataindex
    yAxis.name = yAxis.name || yName
    yAxis.max = max
    yAxis.min = min

    seriesItem.name = seriesItem.name || `${modelCode}图`
    seriesItem.data = data

    const spotColor = seriesItem.itemStyle.normal.color || '#000000'

    seriesItem.itemStyle.normal.color = function (parame) {
      const {	dataIndex } = parame
      if (problemData.includes(dataIndex)) {
        return '#ff0000'
      }
      return spotColor
    }
    seriesItem.markLine.formatter = function (value) {
      return value.value.toFixed(3)
    }
    seriesItem.markLine.data[0].yAxis = cl
    seriesItem.markLine.data[1].yAxis = ucl
    seriesItem.markLine.data[2].yAxis = lcl

    return option
  },
  customXbaxRValue (XbaxRObj, echartOption) {
    const option = JSON.parse(echartOption)
    const {
      title: [titleItem1, titleItem2],
      xAxis: [xAxisItem1, xAxisItem2],
      yAxis: [yAxisItem1, yAxisItem2],
      series: [seriesItem1, seriesItem2],
    } = option

    const [XbaxRObjItem1, XbaxRObjItem2] = XbaxRObj

    titleItem1.text = titleItem1.text || `[${XbaxRObjItem1.modelCode}控制图]`
    titleItem2.text = titleItem2.text || `[${XbaxRObjItem2.modelCode}控制图]`
    xAxisItem1.data = XbaxRObjItem1.dataindex
    xAxisItem2.data = XbaxRObjItem2.dataindex

    yAxisItem1.name = yAxisItem1.name || XbaxRObjItem1.yName
    yAxisItem1.max = XbaxRObjItem1.max
    yAxisItem1.min = XbaxRObjItem1.min

    yAxisItem2.name = yAxisItem2.name || XbaxRObjItem2.yName
    yAxisItem2.max = XbaxRObjItem2.max
    yAxisItem2.min = XbaxRObjItem2.min

    seriesItem1.name = seriesItem1.name || `${XbaxRObjItem1.modelCode}图`
    seriesItem1.data = XbaxRObjItem1.data

    const spotColor1 = seriesItem1.itemStyle.normal.color || '#000000'
    seriesItem1.itemStyle.normal.color = function (parame) {
      const {	dataIndex } = parame
      if (XbaxRObjItem1.problemData.includes(dataIndex)) {
        return '#ff0000'
      }
      return spotColor1
    }

    seriesItem1.markLine.formatter = function (value) {
      return value.value.toFixed(3)
    }
    seriesItem1.markLine.data[0].yAxis = XbaxRObjItem1.cl
    seriesItem1.markLine.data[1].yAxis = XbaxRObjItem1.ucl
    seriesItem1.markLine.data[2].yAxis = XbaxRObjItem1.lcl

    seriesItem2.name = seriesItem2.name || `${XbaxRObjItem2.modelCode}图`
    seriesItem2.data = XbaxRObjItem2.data

    const spotColor2 = seriesItem2.itemStyle.normal.color || '#000000'
    seriesItem2.itemStyle.normal.color = function (parame) {
      const {	dataIndex } = parame
      if (XbaxRObjItem2.problemData.includes(dataIndex)) {
        return '#ff0000'
      }
      return spotColor2
    }

    seriesItem2.markLine.formatter = function (value) {
      return value.value.toFixed(3)
    }
    seriesItem2.markLine.data[0].yAxis = XbaxRObjItem2.cl
    seriesItem2.markLine.data[1].yAxis = XbaxRObjItem2.ucl
    seriesItem2.markLine.data[2].yAxis = XbaxRObjItem2.lcl

    return option
  },
  customCpkValue (cpkObj) {
    const option = JSON.parse(cpkObj.option)
    const {
      title,
      xAxis: [xAxisItem1],
      series: [seriesItem1, seriesItem2, seriesItem3, seriesItem4],
    } = option
    const {
      modelCode,
      rchartdata,
      yArr,
      min,
      max,
      lsl,
      target,
      usl,
      mean,
      sigmaMax,
      sigmaMin,
    } = cpkObj

    title.text = title.text || `[${modelCode} 控制图]`
    xAxisItem1.min = min
    xAxisItem1.max = max
    seriesItem1.data = yArr
    seriesItem2.data = rchartdata

    seriesItem3.markLine.data[0].xAxis = lsl
    seriesItem3.markLine.data[1].xAxis = target
    seriesItem3.markLine.data[2].xAxis = usl

    seriesItem4.markLine.data[0].xAxis = mean
    seriesItem4.markLine.data[1].xAxis = sigmaMax
    seriesItem4.markLine.data[2].xAxis = sigmaMin
    return option
  },
}
