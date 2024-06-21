import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/userRoutes';


const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);



app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
