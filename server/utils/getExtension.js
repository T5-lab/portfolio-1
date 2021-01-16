module.exports = name => {
  const x = name.lastIndexOf('.')
  let z = []
  for(let i = x; i < name.length; i++) {
    z.push(name[i])
  }
  return z.join('')
}
