const express = require('express')
const app = express()
const port = 3000
const users = [
  { id: 1, name: 'Bishmeeta' },
  { id: 2, name: 'Shreya' },
  { id: 3, name: 'Kreeti' }
]

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
  res.send(users)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
