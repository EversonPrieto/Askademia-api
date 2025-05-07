import express from 'express'
const app = express()
const port = 3004

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API: Sistema Askademia')
})

app.listen(port, () => {
  console.log(`Sistema rodando na porta ${port}`)
})