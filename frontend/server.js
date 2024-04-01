import express from 'express';
import cors from 'cors';

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use('/', express.static('dist'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
