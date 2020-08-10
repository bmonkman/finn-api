var sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        db.run(`CREATE TABLE user (
            id UUID PRIMARY KEY,
            name text
            )`,
        (err) => {
        });
    }
});


module.exports = db
