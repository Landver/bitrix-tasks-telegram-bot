const convertDateTime = date_time => {
  // dd.mm.yyyy hh:mm:ss => dd-mm-yyyy hh:mm:ss
  const date = date_time.split(' ')[0].split('.').reverse().join('-')
  const time = date_time.split(' ')[1]

  return `${date} ${time}`
}

module.exports = { convertDateTime }
