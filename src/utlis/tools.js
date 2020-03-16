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