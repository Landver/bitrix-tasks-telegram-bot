const convertDateTime = date_time => {
  // dd.mm.yyyy hh:mm:ss => dd-mm-yyyy hh:mm:ss
  const date = date_time.split(' ')[0].split('.').reverse().join('-')
  const time = date_time.split(' ')[1]

  return `${date} ${time}`
}

const strToMs = str => {
  // hh:mm:ss to milliseconds
  const arr = str.split(':');
  return (+arr[0]) * 3600000 + (+arr[1]) * 60000 + (+arr[2]) * 1000 
}

const msToHours = ms => {
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes

  return `${hours}:${minutes}`
}

module.exports = { convertDateTime, strToMs, msToHours }
