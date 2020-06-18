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
    return data
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
 * @Description: 税金计算   应退金额计算  票面价 + 应退税金  - 已使用票价 = 应退金额
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


/**
 * @Description: 时间处理
 * @author Wish
 * @date 2020/6/11
*/
Vue.prototype.$TimeSetting = (time,format) => {
  if(time){
    const date = new Date(time) || new Date();
    const map = {
      'y': date.getFullYear(),
      'M': date.getMonth() + 1,//month
      'd': date.getDate(),//date
      'H': date.getHours(),//hours
      'm': date.getMinutes(),//minutes
      's': date.getSeconds() //seconds
    };
    for(const i in map){
      if(map.hasOwnProperty(i)){
        if(map[i]<10){
          map[i] = '0'+map[i];
        }
      }
    }
    format = format||'yyyy-MM-dd HH:mm:ss';
    const reg = new RegExp('y+|M+|d+|H+|m+|s+', 'g');
    const regY = new RegExp('y');
    format = format.replace(reg,function(v){
      let old = v;
      if(regY.test(v)){
        const y = "" + map['y'];
        const len = 4 - v.length;
        old = y.substr(len);
      }else{
        const key = v.substr(0, 1);
        old = map[key];
      }
      return old;
    });
    return format;
  }else {
    return time
  }
};


// Vue.prototype.

