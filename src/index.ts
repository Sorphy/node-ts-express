import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import mysql from 'mysql';
// import routes from './routes';

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(routes)

app.get("/", (req, res) => {
  res.send("Welldone Sapphire!")
})

app.post("/register", (req:Request, res:Response) => {
  var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    multipleStatements: true,
  });
  pool.getConnection(function (err: any, conn: any) {
    if (err) {
      console.log("entered error: ", err);
      res.send({
        success: false,
        statusCode: 500,
        message: "Error connecting to database.",
      })
      return;
    }
    console.log('line 91')
    console.log(req.body)
    let sqlQuery = `call registeruser(?,?,?)`;
    // if you got a connection...
    conn.query(sqlQuery, [req.body.email, req.body.phone, req.body.password], function(err: AnalyserNode, rows: any) {
      if(err) {
        conn.release();
        return res.send({
          success: false,
          statusCode: 400,
        });
      }
      console.log('line 100')
      console.log(req.body)
      // for simplicity, just send the rows
      res.send({
        message: "Success",
        statusCode: 200,
        // data: rows
      });
      conn.release(); // always put connection back into the pool when done!
    })
  })
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
