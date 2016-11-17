const express = require ('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

// Serve assets in /public.
app.use(express.static(__dirname + '/public'))

// So we can POST.
app.use(bodyParser.urlencoded({
  extended: true
}))

// Since Mixmax calls this API directly from the client-side, it must be whitelisted.
const corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
}

// The editor interface.
app.get('/editor', (request, response) => {
  response.sendFile(__dirname + '/editor.html')
})

// The in-email representation.
app.post('/api/resolver', cors(corsOptions), require('./api/resolver'))

app.listen(process.env.PORT || 8910)