module.exports = l => {
  l = l.toLowerCase()
  l = l.split("")
  const z = l.findIndex(i => {
    return i === "@"
  })
  l = l.join("")
  let t = []
  for(let i = 0; i < z; i++) {
    t.push(l[i])
  }
  t = t.filter(i => i === ".")
  for(let x = 0; x < t.length; x++) {
    l = l.replace(".", "")
  }
  return l
}
