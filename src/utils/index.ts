import moment from "moment";

export const checkQuantity = ({ value, minQty, maxQty, stock }: { value: number, minQty: number, maxQty: number, stock: number }) => {
  if ( value > stock ){
    return stock
  }
  if(minQty === 0 && maxQty === 0){
    return value
  } else if (value < 0 || (value <= minQty)) {
    return minQty
  } else if (value > maxQty) {
    if (maxQty === 0) {
      return stock
    }
    return maxQty
  }
  return value
}

export const calculateUpcomingDay = ({ day }: { day: number }) => {
  if(moment().isoWeekday() < day){
    return moment().isoWeekday(day);
  }
  return moment().add(1, 'weeks').isoWeekday(day)
}

export const formatComma = (val: string) => {
  return !isNaN(parseFloat(val)) ? parseFloat(val).toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",") : val;
}