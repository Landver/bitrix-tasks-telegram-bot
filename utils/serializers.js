const convertDateTime = date_time => {
  // dd.mm.yyyy hh:mm:ss => dd-mm-yyyy hh:mm:ss
  const date = date_time.split(' ')[0].split('.').reverse().join('-')
  const time = date_time.split(' ')[1]

  return `${date} ${time}`
}

const strToMs = str => {
  // hh:mm:ss to milliseconds
  const arr = str.split(':');
  return 1000 * (+arr[0]) * 60 * 60 + (+arr[1]) * 60 + (+arr[2]) 
}

const msToHours = ms => Math.floor((ms / (1000 * 60 * 60)) % 24) 

module.exports = { convertDateTime, strToMs, msToHours }
