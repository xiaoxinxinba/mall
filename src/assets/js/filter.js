//金额转换
export let moneyFormat = value =>{
  let tempVal = parseFloat(value).toFixed(3)
  let realVal = tempVal.substring(0, tempVal.length - 1)
  return realVal
}
