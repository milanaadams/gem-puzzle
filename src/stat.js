// add a leading zero to timer

export default function addZero(num) {
  return (parseInt(num, 10) < 10 ? '0' : '') + num;
}
