import Vue from "vue";
/**
 * @Description: 时间戳转换
 * @author Wish
 * @date 2020/3/16
 */
Vue.prototype.$getTime = (data) =>{
  if(data){
    let date = new Date(data);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return year
      + "-" + (month < 10 ? "0" + month : month)
      + "-" + (day < 10 ? "0" + day : day)
      + " " + (hour < 10 ? "0" + hour : hour)
      + ":" + (minute < 10 ? "0" + minute : minute)
      // + ":" + (second < 10 ? "0" + second : second);
  }else {
    return null
  }
}


/**
 * @Description: 拆分数组，组成字符串
 * @author Wish
 * @date 2020/6/9
*/
Vue.prototype.$getTicketNumber = (data) =>{
  if(data.length > 0){
    let ticketNumber = []
    data.forEach(item =>{
      ticketNumber.push(item.TicketNo)
    })
    return String([...new Set(ticketNumber)]).replace(',','/')
  }else {
    return data
  }
}


/**
 * @Description: 税金计算
 * @author Wish
 * @date 2020/6/9
 */
Vue.prototype.$Tax = (data) =>{
  let tax = 0
  Object.keys(data).forEach(item =>{
    tax += data[item]
  })
  return tax
}



// 应退金额计算  票面价 + 应退税金  - 已使用票价 = 应退金额