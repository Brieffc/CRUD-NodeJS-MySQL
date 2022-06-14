const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql4",
});

module.exports = pool;


/* crio essa pasta db para realizar a conexão com o banco de dados, importo o create pool com conexão limite de 10 e não preciso
mais da conexão direta que ficava no main */
