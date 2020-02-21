/**
		 * @description 处理8大异常的函数
		 * @param {segment} 截取数组长度
		 * @param {total} 截取数组累加数
		 * @param {greater} 大于某个数
		 * @param {less} 小于某个数
		 */
const getSpc1 = (parameObj) => {
  const {
    data,
    greater,
    less,
    // up3Sigma,
    // down3Sigma,

  } = parameObj

  const spcArr = data.map((MapItem, i) => {
    if (MapItem > greater || MapItem < less) {
      return i
    }
  }).filter(filterItem => {
    return filterItem !== undefined
  })
  return spcArr || []
}

// 异常2,5,6
const getSpc2 = (parameObj) => {
  const {
    data,
    segment,
    total,
    greater,
    less,
  } = parameObj

  const upArr = data.map(upMapItem => {
    if (upMapItem > greater) {
      return 1
    }
    return 0
  })

  const underArr = data.map(underMapItem => {
    if (underMapItem < less) {
      return 1
    }
    return 0
  })

  const upSpcArr = getSeries({
    data: upArr,
    segment,
    total,
  })
  const underSpcArr = getSeries({
    data: underArr,
    segment,
    total,
  })

  return upSpcArr.concat(underSpcArr)
}

// 异常3
const getSpc3 = (parameObj) => {
  const {
    data,
    segment,
    total,
  } = parameObj

  const higArr = getCompare({
    data: data,
    segment,
    total,
    type: 'high',
  })
  const lowArr = getCompare({
    data: data,
    segment,
    total,
    type: 'low',
  })

  return higArr.concat(lowArr)
}

// 异常4
const getSpc4 = (parameObj) => {
  const { data, segment } = parameObj
  return getWave({ data, segment })
}

// 异常7,8
const getSpc7 = (parameObj) => {
  const {
    data,
    segment,
    total,
    greater,
    less,
    cl,
    type,
  } = parameObj

  const newArr = data.map(upMapItem => {
    if (type === 'eight') {
      return upMapItem > greater || upMapItem < less ? 1 : 0
    }

    if (type === 'seven') {
      return upMapItem > greater && upMapItem < cl || upMapItem < less && upMapItem > cl ? 1 : 0
    }
  })

  return getSeries({ data: newArr, segment, total })
}

// -------公共的函数-------
/**
	* @description 异常2，3，6筛选指点连续的点的下标
	*  @param {segment} 截取数组长度
	* @param {total} 截取数组累加数
**/
function getSeries (parameObj) {
  const {
    data,
    segment,
    total,
  } = parameObj
  const resultArr = []

  data.forEach((item, i, arr) => {
    const sliceArr = arr.slice(i, i + segment)
    const sum = totalSumFn(sliceArr)

    if (sliceArr.length === segment && sum === total) {
      const indexArr = getIndex({ i, segment })
      resultArr.push(...indexArr)
    }
  })

  return Array.from(new Set(resultArr))
}

/**
  * @description 获取连续递增，递减的数组
**/
function getCompare (parameObj) {
  const { data, segment, total, type } = parameObj
  const resultArr = []
  data.forEach((item, i, arr) => {
    const sliceArr = arr.slice(i, i + segment)
    const mapArr = sliceArr.map((item, i, arr) => {
      const j = i + 1
      if (arr.length !== j && type === 'high') {
        return item < arr[j] ? 1 : 0
      }
      if (arr.length !== j && type === 'low') {
        return item > arr[j] ? 1 : 0
      }
      return 0
    })
    const filterArr = mapArr.filter(item => {
      return item === 0
    })
    const sum = totalSumFn(mapArr)

    if (sliceArr.length === segment && filterArr.length === 1 && sum === total) {
      const indexArr = getIndex({ i, segment })
      resultArr.push(...indexArr)
    }
  })
  return Array.from(new Set(resultArr))
}

/**
	* @description 获取连续交错下标的数组
	* @param {total} 截取数组累加数,大小的累加数1,小大累加数-1
	* @param {type} 选择大小，还是小大
 **/
function getWave (parameObj) {
  const {
    data,
    segment,
  } = parameObj
  // console.log('parameObj',parameObj)

  const resultArr = []

  data.forEach((item, i, arr) => {
    const sliceArr = arr.slice(i, i + segment)

    const mapArr = sliceArr.map((item, i, arr) => {
      const j = i + 1
      if (j !== segment) {
        return item < arr[j] ? -1 : item > arr[j] ? 1 : 0
      }
      return 0
    })

    const filterArr = mapArr.filter(item => {
      return item === 0
    })

    if (sliceArr.length === segment && filterArr.length === 1) {
      const sumArr = mapArr.map((sumItem, sumIndex, arr) => {
        if (sumIndex + 1 !== arr.length) {
          return (sumItem + arr[sumIndex + 1])
        } else {
          return 0
        }
      }).filter((item) => { return item })

      const [sum] = sumArr
      if (sumArr.length === 1 && sum === 1 || sum === -1) {
        const indexArr = getIndex({ i, segment })
        resultArr.push(...indexArr)
      }
    }
  })

  return Array.from(new Set(resultArr))
}

/**
	* @description 获取连续下标数组
	* @param {i} 循环i传值
**/

function getIndex (parameObj) {
  const { i, segment } = parameObj
  const arr = []

  let j = i
  const len = i + segment
  for (j; j < len; j++) {
    arr.push(j)
  }
  return arr
}

/**
  * @description 获取累加数的值
  * @param {arr} 需要累加的数组
**/
function totalSumFn (arr) {
  return arr.reduce(function (prev, curr, idx, arr) {
    return prev + curr
  })
}

export default {
  getSpc1,
  getSpc2,
  getSpc3,
  getSpc4,
  getSpc7,
}

