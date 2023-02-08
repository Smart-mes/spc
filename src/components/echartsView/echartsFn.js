export default {
  drowxbar (objParame) {
    const { modelCode, dataindex, yName, max, min, cl, ucl, lcl, data, problemData } = objParame
    return {
      title: {
        text: `[${modelCode} 控制图]`,
        top: 'top',
        left: 'center',
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal',
        },
      },
      grid: {
        left: '10%',
        right: '10%',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: dataindex,
      },
      yAxis: {
        name: yName,
        nameLocation: 'middle',
        nameGap: 50,
        splitNumber: 5,
        max: max,
        min: min,
        splitLine: {
          show: false,
        },
      },
      series: [{
        name: `${modelCode}图`,
        data: data,
        type: 'line',
        itemStyle: {
          normal: {
            color: function (parame) { // 折点颜色
              const { dataIndex } = parame
              if (problemData.includes(dataIndex)) {
                return '#ff0000'
              }
              return '#000000'
            },
            lineStyle: {
              color: '#000000', // 折线颜色
            },
          },
        },
        markLine: {
          symbol: ['none', 'none'],
          precision: 3,
          label: {
            formatter: function (value) {
              return value.value.toFixed(3)
            },
            normal: {
              formatter: '{b}:{c}',
            },
          },
          lineStyle: {
            color: '#ff0000',
          },
          data: [
            {
              name: 'CL',
              yAxis: cl,
            },
            {
              name: 'UCL',
              yAxis: ucl,
            },
            {
              name: 'LCL',
              yAxis: lcl,
            },
          ],
        },
      }],
    }
  },
  drowXbarR (dataParame) {
    const [xbarRItem1, xbarRItem2] = dataParame
    // console.log('xbarRItem2', xbarRItem2)
    return {
      title: [
        {
          text: `[${xbarRItem1.modelCode}控制图]`,
          top: 'top',
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
        {
          text: `[${xbarRItem2.modelCode}控制图]`,
          top: '50%',
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
      ],
      grid: [
        {
          top: '15%',
          bottom: '60%',
        },
        {
          top: '60%',
          bottom: '15%',
        },
      ],
      // 鼠标移动上去同时触发
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all',
        },
      },
      xAxis: [{
        type: 'category',
        data: xbarRItem1.dataindex,
      },
      {
        type: 'category',
        data: xbarRItem2.dataindex,
        gridIndex: 1,
      },
      ],
      yAxis: [
        {
          name: xbarRItem1.yName,
          nameLocation: 'middle',
          nameGap: 50,
          splitNumber: 5,
          splitLine: {
            show: false,
          },
          max: xbarRItem1.max,
          min: xbarRItem1.min,
        },
        {
          name: xbarRItem2.yName,
          nameLocation: 'middle',
          nameGap: 50,
          splitNumber: 5,
          splitLine: {
            show: false,
          },
          max: xbarRItem2.max,
          min: xbarRItem2.min,
          gridIndex: 1,
        },
      ],
      series: [
        {
          name: `${xbarRItem1.modelCode}图`,
          data: xbarRItem1.data,
          type: 'line',
          itemStyle: {
            normal: {
              color: function (parame) {
                const { dataIndex } = parame
                if (xbarRItem1.problemData.includes(dataIndex)) {
                  return '#ff0000'
                }
                return '#000000'
              },
              lineStyle: {
                color: '#000000',
              },
            },
          },
          markLine: {
            symbol: ['none', 'none'],
            precision: 3, // 精度
            label: {
              formatter: function (value) {
                return value.value.toFixed(3)
              },
              normal: {
                formatter: '{b}:{c}',
              },
            },
            itemStyle: {
              normal: {
                color: '#d53a35',
              },
            },
            data: [
              {
                name: 'CL',
                yAxis: xbarRItem1.cl,
              },
              {
                name: 'UCL',
                yAxis: xbarRItem1.ucl,
              },
              {
                name: 'LCL',
                yAxis: xbarRItem1.lcl,
              },
            ],
          },
        },
        {
          name: `${xbarRItem2.modelCode}图`,
          data: xbarRItem2.data,
          xAxisIndex: 1,
          yAxisIndex: 1,
          type: 'line',
          itemStyle: {
            normal: {
              color: function (parame) { // 折点颜色
                const { dataIndex } = parame
                if (xbarRItem2.problemData.includes(dataIndex)) {
                  return '#ff0000'
                }
                return '#000000'
              },
              lineStyle: {
                color: '#000000', // 折线颜色
              },
            },
          },
          markLine: {
            symbol: ['none', 'none'],
            precision: 3,
            label: {
              formatter: function (value) {
                return value.value.toFixed(3)
              },
              normal: {
                formatter: '{b}:{c}',
              },
            },
            itemStyle: {
              normal: {
                color: '#d53a35',
              },
            },
            data: [
              {
                name: 'CL',
                yAxis: xbarRItem2.cl,
              },
              {
                name: 'UCL',
                yAxis: xbarRItem2.ucl,
              },
              {
                name: 'LCL',
                yAxis: xbarRItem2.lcl,
              },
            ],
          },
        },
      ],
    }
  },
  drowCPK (objParame) {
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
    } = objParame

    return {
      title: {
        text: `[${modelCode}控制图]`,
        top: 'top',
        left: 'center',
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal',
        },
      },
      color: ['#7CCD7C', '#d14a61', '#675bba'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: [{
        type: 'value',
        min: min,
        max: max,
      }],
      yAxis: [{
        type: 'value',
        name: '频率',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#d14a61',
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
      }, {
        type: 'value',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#7CCD7C',
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
      }],
      series: [{
        name: '原数据频率',
        type: 'bar',
        yAxisIndex: 1,
        data: rchartdata,
      }, {
        name: '正态分布',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: yArr,
      },
      {
        name: 'markLine1',
        type: 'line',
        markLine: {
          precision: 3,
          label: {
            position: 'end',
            normal: {
              formatter: '{b}',
            },
          },
          lineStyle: {
            type: 'solid',
            color: '#000000',
          },
          data: [{
            name: 'lsl',
            xAxis: lsl,
          }, {
            name: 'target',
            xAxis: target,
          }, {
            name: 'usl',
            xAxis: usl,
          }],
        },
      },
      {
        name: 'markLine2',
        type: 'line',
        markLine: {
          precision: 3,
          label: {
            position: 'end',
            normal: {
              formatter: '{b}',
            },
          },
          lineStyle: {
            type: 'solid',
            color: '#6666cc',
          },
          data: [{
            name: 'mean',
            xAxis: mean,
          }, {
            name: '+3sigma',
            xAxis: sigmaMax,
          }, {
            name: '-3sigma',
            xAxis: sigmaMin,
          }],
        },
      }],
    }
  },
}
