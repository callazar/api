const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

class method {
  generateJwtToken(userData) {
    const secretKey = "your_secret_key_here"; // Ganti dengan secret key yang aman di aplikasi produksi
    const expiresIn = "1h"; // Token akan kedaluwarsa dalam 1 jam (opsional, sesuaikan dengan kebutuhan)

    const token = jwt.sign(userData, secretKey, { expiresIn });

    return token;
  }

  hashPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          reject(err);
        } else {
          resolve(hashedPassword);
        }
      });
    });
  }

  // dataBase(sql, config) {
  //   const konek = mysql.createConnection(config);

  //  konek.connect((err) => {
  //     if (err) {
  //       console.error(err);
  //       return err;
  //     }

  //     return konek.query(sql.query, sql.params, (error, result) => {
  //       konek.end();

  //       if (error) {
  //         console.error(error);
  //         return error;
  //       }

  //       return result;
  //     });

  //   });
  //   console.log(444,konek._events)
  //   return konek;
  // }

  dataBase(sql, config) {
    const konek = mysql.createConnection(config);
    konek.connect();

    konek.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
      if (error) throw error;
      console.log("The solution is: ", results[0].solution,results);
    });

    konek.end();

    console.log(444, konek);
    return konek;
  }
}

module.exports = new method();
