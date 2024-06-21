import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());



app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});



