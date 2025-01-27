import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.connection';
import generateToken from '../config/token.generate';
import authenticate from '../config/auth.token';
import apicache from "apicache";
import { default as axios } from "axios";

let cache = apicache.middleware;

const saltRounds = 10;
const usersRouter = Router();

usersRouter.get('/', (req: Request, res:Response) => {
    return res.json("OK");
});
usersRouter.get(
  "/all",
  authenticate,
  cache("5 minutes"),
  (req: Request, res: Response) => {
    pool.getConnection(function (err: any, conn: any) {
      if (err) {
        console.log("Entered into error");
        console.log(err);
        res.send({
          success: false,
          statusCode: 500,
          message: "Error connecting to database.",
        });
        return;
      }
      console.log("line 27");
      // if connection is established
      pool.query(
        "SELECT Id, Email, Mobile, InsertDateTimeUtc as CreatedDate FROM register",
        function (err, rows: any) {
          if (err) {
            conn.release();
            return res.send({
              success: false,
              statusCode: 400,
            });
          }
          res.send({
            message: "Success",
            statusCode: 200,
            data: rows,
          });
          conn.release();
        }
      );
    });
  }
);

usersRouter.get('/details/:id', authenticate,  (req: Request, res: Response) => {
    pool.getConnection(function (err:any, conn:any) {
        if (err) {
            console.log("Entered into error")
            console.log(err)
            res.send({
                success: false,
                statusCode: 500,
                message: "Error connecting to database.",
            })
            return;
        }
        console.log('The id: ' + req.params.id)

        // if you get a connection...
        pool.query('SELECT * FROM register WHERE id =?', [req.params.id], function (err: any, rows: any) {
            if (err) {
                conn.release();
                return res.send({
                    success: false,
                    statusCode: 400,
                });
            }
            console.log(rows)
            res.send({
                message: "Success",
                statusCode: 200,
                data: rows
            });
            conn.release(); // always put connection back in the pool when done!
        })
    })
})
 
usersRouter.post("/register", (req: Request, res: Response) => {
    pool.getConnection(function (err: any, conn: any) {
        if (err) {
            console.log("entered error: ", err);
            res.send({
                success: false,
                statusCode: 500,
                message: "Error connecting to database.",
            });
            return;
        }
      
        bcrypt.hash(req.body.password, saltRounds, (err: any, hash: string) => {
            if(err) { 
                  res.send({
                    success: false,
                    statusCode: 500,
                    message: "Error connecting to database.",
                  });
                  return;
            }
            else {
                
                let sqlQuery = `call registeruser(?,?,?)`;
                // if you got a connection...
                conn.query(
                  sqlQuery,
                  [req.body.email, req.body.phone, hash],
                  function (err: AnalyserNode, rows: any) {
                    if (err) {
                      conn.release();
                      return res.send({
                        success: false,
                        statusCode: 400,
                      });
                    }
                    console.log("line 100");
                    console.log(req.body);
                    // for simplicity, just send the rows
                    res.send({
                      message: "Success",
                      statusCode: 200,
                      // data: rows
                    });
                    conn.release(); // always put connection back into the pool when done!
                  }
                );
            }
        })
  });
});
usersRouter.post("/login", (req: Request, res: Response) => {
    pool.getConnection(function (err: any, conn: any) {
        if (err) {
            console.log("entered error: ", err);
            res.send({
                success: false,
                statusCode: 500,
                message: "Error connecting to database.",
            });
            return;
        }
        console.log(req.body);
        pool.query('SELECT password FROM register WHERE email=?', [req.body.email], function (err: any, rows: any) {
            if (err) {
                conn.release();
                return res.send({
                    success: false,
                    statusCode: 400,
                    data: err
                });
            }
            console.log(rows[0].password);
            const hash = rows[0].password;
            bcrypt.compare(req.body.password, hash, function (err, result) {
                if (err) {
                    res.send({
                        message: "failed",
                        statusCode: 500,
                        data: err
                    });
                }
                if (result) {
                    res.send({
                        message: "success",
                        statusCode: 200,
                        data: {
                            token: generateToken(req.body.email)
                        }
                    });
                } else {
                    res.send({
                      message: "failed",
                      statusCode: 500,
                      data: err,
                    });
                }
            });
            // CLOSE THE CONNECTION
            conn.release();
        });
    });
});

usersRouter.post('/Id/:id/Name/:name', (req: Request, res: Response) => { 
    res.send({
        data: req.body,
        params: {
            id: req.params.id,
            name: req.params.name,
        }
    })
});

// create 100 users by calling register api
usersRouter.post('/create100users', authenticate, (req: Request, res: Response) => {
    let num = 7;
    function prefix(num: number) {
      if (num < 10) return `0${num}`;
      else return `${num}`; // if num is 10 or more, just return it as it is.
    }
    const createPromises = [];
    // install axios
    for (let i = 0; i < 100; i++) {
      const promise = axios.post("http://localhost:3000/users/register", {
        email: `saph${prefix(num++)}@nodetsexpress.com`, // Fixed string concatenation
        phone: "08098765432",
        password: "Oppppd38983",
      });
      createPromises.push(promise);
    }

    // Wait for all requests to complete before sending response
    Promise.allSettled(createPromises)
      .then((results) => {
        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;

        res.send({
          message: `${successful} users created successfully, ${failed} failed`,
          statusCode: 200,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Error creating users",
          statusCode: 500,
          error: error.message,
        });
      });
})

export default usersRouter;
