import express from 'express';
import routerApi from './routes';
import config from './config';

const PORT = config.port;
const app = express();


app.use(express.json());
routerApi(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})