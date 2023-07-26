const express = require("express");
const mysql = require("mysql");
const method = require("./method.js");

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345",
  database: "test_db",
  port: 3306,
};
// getbyid
app.get("/api/data/:id", function (req, res) {
  const { id } = req.params;

  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "failed" });
      return;
    }

    const query = "SELECT id,name,email FROM users WHERE id = ?";
    connection.query(query, [id], (error, result) => {
      connection.end();

      if (error) {
        console.error(error);
        res.status(500).json({ error: "failed" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ error: "data not found" });
        return;
      }
      res.json(result[0]);
    });
  });
});
// getbyemail
app.get("/api/data", function (req, res) {
  const { email } = req.query;

  if (!email) {
    res.status(400).json({ error: "email parameter is required" });
    return;
  }

  const connector = mysql.createConnection(dbConfig);

  connector.connect((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "failed" });
      return;
    }

    const query = "SELECT id,name,email FROM users WHERE email = ?";
    connector.query(query, [email], (error, result) => {
      connector.end();

      if (error) {
        console.error(error);
        res.status(500).json({ error: "failed" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ error: "data not found" });
        return;
      }
      res.json(result[0]);
    });
  });
});
// getall
app.get("/api/user", (req, res) => {
  
  const token = mysql.createConnection(dbConfig);

  token.connect((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "failed" });
      return;
    }

    const query = "SELECT * FROM users";
    token.query(query, (error, result) => {
      token.end();

      if (error) {
        console.error(error);
        res.status(500).json({ error: "failed" });
        return;
      }
      res.json(result);
    });
  });
});
// adduser but use password decrypt
app.post("/api/data/user", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, age and password are requaired" });
    return;
  }

  const hash = await method
  .hashPassword(password)
  .then((hashedPassword) => {return {data:hashedPassword}})
  .catch((err) => {
        console.error("Error hashing password", err);
        res.status(500).json({ error: "failed to create user" });
      });
  console.log(222,hash);

  const sql = {
    query:`INSERT INTO users (name, email, password) VALUES (?, ?, ?);`,
    params:[name, email, hash.data]
  }
  const save = method.dataBase(sql,dbConfig)

  console.log(333,save)

  res.json({ message: "user created", id: save ? save.insertID:null });
  // const konek = mysql.createConnection(dbConfig);

  //     konek.connect((err) => {
  //       if (err) {
  //         console.error(err);
  //         res.status(500).json({ error: "Failed" });
  //         return;
  //       }
  //       const query =
  //         "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  //       konek.query(query, [name, email, hash.data], (error, result) => {
  //         konek.end();

  //         if (error) {
  //           console.error(error);
  //           res.status(500).json({ error: "failed to create user" });
  //           return;
  //         }

  //         res.json({ message: "user created", id: result.insertID });
  //       });
  //     });

  // method
  //   .hashPassword(password)
  //   .then((hashedPassword) => {
  //     const konek = mysql.createConnection(dbConfig);

  //     konek.connect((err) => {
  //       if (err) {
  //         console.error(err);
  //         res.status(500).json({ error: "Failed" });
  //         return;
  //       }
  //       const query =
  //         "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  //       konek.query(query, [name, email, hashedPassword], (error, result) => {
  //         konek.end();

  //         if (error) {
  //           console.error(error);
  //           res.status(500).json({ error: "failed to create user" });
  //           return;
  //         }

  //         res.json({ message: "user created", id: result.insertID });
  //       });
  //     });
  //   })
  //   .catch((err) => {
  //     console.error("Error hashing password", err);
  //     res.status(500).json({ error: "failed to create user" });
  //   });
});
// updatebyid
app.put("/api/data/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, age and password are requaired" });
    return;
  }

  method
    .hashPassword(password)
    .then((passhashing) => {
      const koneksi = mysql.createConnection(dbConfig);

      koneksi.connect((err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "faied to connect database" });
          return;
        }

        const query =
          "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        koneksi.query(query, [name, email, passhashing, id], (error) => {
          koneksi.end();

          if (error) {
            console.error("Error executing query:", error);
            res.status(500).json({ error: "Failed to update user" });
            return;
          }

          res.json({ message: "users updated" });
        });
      });
    })
    .catch((err) => {
      console.error("Error hashing password", err);
      res.status(500).json({ error: "failed to create user" });
    });
});
// deletebyid
app.delete("/api/user/:id", (req, res) => {
  const { id } = req.params;

  const konektor = mysql.createConnection(dbConfig);

  konektor.connect((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "failed to connect database" });
      return;
    }

    const query = "DELETE FROM users WHERE id = ?";
    konektor.query(query, [id], (error, result) => {
      konektor.end();

      if (error) {
        console.error(error);
        res.status(500).json({ error: "failed to delete user" });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(400).json({ error: "user not found" });
        return;
      }

      res.json({ message: "user deleted" });
    });
  });
});

const port = 10000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
