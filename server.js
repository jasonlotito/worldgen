const jsonServer = require('json-server')
const app = jsonServer.create()
const port = 3010
const fs = require('fs')
const bodyParser = require('body-parser')
const router = jsonServer.router('./data/db.json')
app.use(bodyParser.json())

class JsonSync {
  constructor(name) {
    this.file = `store/${name}.json`
    this.data = JSON.parse(fs.readFileSync(this.file))
  }

  store(data) {
    this.data = data;
    fs.writeFileSync(this.file, data)
  }
}

class JsonSyncCollection {
  constructor() {
    this.syncs = new Map();
  }
  addSync(syncName) {
    if (this.syncs.has(syncName)) {
      return this.syncs.get(syncName)
    }

    this.syncs.set(syncName,new JsonSync(syncName))
    return this.syncs.get(syncName)
  }
  add(syncName) { return this.addSync(syncName) }
}

const syncs = new JsonSyncCollection()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "content-type")
  next();
})

app.post('/sync', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "content-type")
  let body = req.body

  body.forEach(console.log)
  res.send(res.ok)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
