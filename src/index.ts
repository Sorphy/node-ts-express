import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes)

app.get("/", (req, res) => {
  res.send("Welldone Sapphire!")
})

app.get("/Id/:id/Name/:name", (req: Request, res:Response) => {
  res.send({
    message: "Hello World!",
    id: req.params.id,
    name: req.params.name
  });
});
app.get("/greet-host", (req, res) => {
  res.send("Hello Sofiyyah Abidoye!");
});
app.post("/Id/:id/Name/:name", (req: Request, res: Response) => {
  res.send({
    data: req.body,
    params: {
      id: req.params.id,
      name: req.params.name,
    }
  });
});

app.listen(process.env.PORT, () => {
  // console.log(`The application is listening on port ${process.env.PORT}!`);
  console.log("The application is listening on port " + process.env.PORT);
});






// call registeruser("example@example.com", "1234567890", "securepassword");
// select * from users
// desc users;
// truncate users;
