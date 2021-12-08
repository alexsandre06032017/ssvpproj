const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sessions = require("express-session");
const { render } = require("ejs");
const app = express();
const PORT = process.env.PORT || 3000;
const oneDay = 1000 * 60 * 60 * 24;//milissegundos
const client = require("./db");

const db = client.db("ssvp");
const doacaocollection = db.collection("doacao");

app.use(sessions({
    secret: "thisismysecretkeyfhrg84",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname));

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

var session;


app.set("view engine", "ejs");

app.get("/", function (req, res) {
    session = req.session;

    if (session.userid) {
        res.send("Bem vindo a página da SSVP de Porto Seguro!! <a href = \'/logout'> clique para logar </a>");
    }
    else {
        res.render("home");
    }
});

const cargo ="confrade";

app.post("/cadastrodoacao", function (req, res) {
    res.render("cadastrodoacao");
    /*if(req.body.cargo != cargo){
        senha = "123";
    }
    else{
        senha = "321";
    }

    if (req.body.confrade == confrade && req.body.senha == senha) {
        if(req.body.cargo != cargo){
        session = req.session;
        session.userid = req.body.confrade;
        console.log(req.session);
        res.render("cadastrodoacao");
        }

        else{
            session = req.session;
            session.userid = req.body.email;
            console.log(req.session);
            res.redirect("listadoacoes");    
        }
    }

    else {
        res.send("nome ou senha invalida");
    }*/
});
//function verifyJWT(req, res, next){
    //const token = req.headers['x-access-token'];
    //if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    //
    //jwt.verify(token, process.env.SECRET, function(err, decoded) {
      //if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      //
      // se tudo estiver ok, salva no request para uso posterior
      //req.userId = decoded.id;
    //  next();
  //  });
//}

//app.post('/logout', function(req, res) {
  //  res.json({ auth: false, token: null });
//})

app.post("/listadoacoes", (req, res) => {
    doacaocollection.insertOne(req.body).then(result => {
        console.log(result)
        console.log(req.body)
        res.redirect("/listadoacoes")
    })
        .catch(error => console.error(error))
});

app.post("/delete", (req, res) => {
    doacaocollection.deleteOne(req.body).then(result => {
        console.log(result)
        console.log(req.body)
        res.redirect("/listadoacoes")
    })
        .catch(error => console.error(error))
});

app.get("/listadoacoes", (req, res) => {
    var cursor = doacaocollection.find().toArray(function (err, result) {
        if (err) {
            return console.log(err)
        } else {
            console.log(result)
            res.render("listadoacoes", { doacao: result })
        }
    })
});

app.post("/update", (req, res) => {
      doacaocollection.findOneAndUpdate({ confrade: req.body.confrade }, {
        $set:
              {conferencia:req.body.conferencia}
           // {confrade:req.body.confrade,conferencia:req.body.conferencia}
    },
    {upsert:true})
        .then(result => res.json(req.body))
        .catch(error => console.error(error))
});

app.get("/logout", function (req, res) {
    req.session.destroy()
    res.redirect("/")
});

app.listen(PORT, function () {
    console.log(" servidor rodando na porta", { PORT })
});
//req.params.id
//https://www.geeksforgeeks.org/mongodb-db-collection-findoneandupdate-method/

//https://masteringjs.io/tutorials/mongoose/findoneandupdate






