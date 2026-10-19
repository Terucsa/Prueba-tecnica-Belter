import express from 'express';
import routes from './routes/index.route.js';
import cors from 'cors'; 

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});