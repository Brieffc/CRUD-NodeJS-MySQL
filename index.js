//chamamos os modulos
const express = require("express");
const exphbs = require("express-handlebars");
const pool = require("./db/conn");

const app = express();
//configurando o express pra poder utilizar o body
app.use(
  express.urlencoded({
    extended: true,
  })
);
//conseguir pegar o body em json
app.use(express.json());

//configurando o template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//ponto para os arquivos estaticos em public
app.use(express.static("public"));

//primeira rota
app.get("/", (req, res) => {
  res.render("home");
});

//enviando para o banco de dados pela rota /book/insertbook, função anonima req, res
app.post("/books/insertbook", (req, res) => {
  //extração de dados, title e pageqty
  const title = req.body.title;
  const pageqty = req.body.pageqty;
  //query= instrução do banco de dados
  const sql = `INSERT INTO books (??, ??) VALUES(?, ?)`;

  const data = ["title", "pageqty", title, pageqty];

  //método de query do mysql com função anonima(callback) se tiver erro exibir, se não redirecionar para home
  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect("/books");
  });
});

//criando rota de get para resgatar os books
app.get("/books", (req, res) => {
  //resgatando todas as colunas com (select * from books) da tabela books
  const sql = "SELECT * FROM books";
  //executamos a query dele, com uma função anonima com erros ou os dados que foram resgatados pela query
  pool.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      //se houver erro, return para para execução do programa
      return;
    }
    //se veio os dados chama o books
    const books = data;
    console.log(books);
    //passo o objeto books para a view books.handlebars que to resgatando
    res.render("books", { books });
  });
});

//crio uma rota e passo o id
app.get("/books/:id", (req, res) => {
  //pego o id
  const id = req.params.id;
  //filtro para pegar só o id
  const sql = `SELECT * FROM books WHERE ??= ?`;
  const data = ["id", id];
  //
  pool.query(sql, data, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    //primeiro array da lista
    const book = data[0];
    //mando para a view book
    res.render("book", { book });
  });
});
//crio uma rota para editar o book
app.get("/books/edit/:id", (req, res) => {
  //id de req.params.id
  const id = req.params.id;

  //resgato um id baseado no id do banco
  const sql = `SELECT * FROM books WHERE id = ${id}`;
  //executo a query com callback
  pool.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    //edito um livro por vez
    const book = data[0];
    //mando para view
    res.render("editbook", { book });
  });
});

//crio uma rota post para atualizar o book
app.post("/books/updatebook", (req, res) => {
  //resgato os dados que vieram pelo body
  const id = req.body.id;
  const title = req.body.title;
  const pageqty = req.body.pageqty;
  //substituimos os dados por (?) para proteger
  const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`;
  //array dizendo o que foi substituido pela (?) (tile) etc..
  const data = ["title", title, "pageqty", pageqty, "id", id];
  //executo a sql com callback
  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    //mando para books e vejo o dado atualizado na lista
    res.redirect("/books");
  });
});
//crio uma rota para deletar o book passando a url que coloquei no html dinâmico
app.post("/books/remove/:id", (req, res) => {
  //acesso do id pela url
  const id = req.params.id;
  //query para deletar o book pelo id
  const sql = `DELETE FROM books WHERE id = ${id}`;
  //executo a sql com callback
  pool.query(sql, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    //redireciono para books
    res.redirect("/books");
  });
});

app.listen(3000);

//removi a conexão e deixei só a listen para ouvir, troquei os (conn) e troquei por pool que está na pasta db/conn.js
//fizemos isso para utilizar o recurso de cache para entregar de forma mais rápido ao usuario.
