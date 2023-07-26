class userModule {
  addUser(userData) {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "name, age and password are requaired" });
      return;
    }

    const konek = mysql.createConnection(dbConfig);

    konek.connect((err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed" });
        return;
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "failed to create new user" });
          return;
        }

        const query =
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        konek.query(query, [name, email, hashedPassword], (error, result) => {
          konek.end();

          if (error) {
            console.error(error);
            res.status(500).json({ error: "failed to create user" });
            return;
          }

          res.json({ message: "user created", id: result.insertID });
        });
      });
    });
  }
}

module.exports = new userModule();
