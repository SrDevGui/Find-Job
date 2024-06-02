const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const db = require('./db/conection')
const path = require('path') //pacote de path do node
const bodyParser = require('body-parser')
const PORT = 3000
const Job = require('./models/Job')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

app.listen(PORT, function () {
    console.log(`O express está rodando na porta ${PORT}`)
})
// Ler o corpo exportado
app.use(bodyParser.urlencoded({ extended: false }))

//handle bars
app.set('views', path.join(__dirname, 'views')) // mostrando o diretório das views
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))//layout principal da aplicação
app.set('view engine', 'handlebars') // dizendo para o expres qual o framework ou lib que vai renderizar as views

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// db conection
db.authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso")
    }).catch(err => {
        console.log("Ocorreu um erro ao conectar", err)
    })


// routs 
app.get('/', (req, res) => {
    let search = req.query.job
    let query = '%' + search + '%' //consulta query like

    if (!search) {
        Job.findAll({
            order: [
                ['createdAt', 'DESC']]
        }) //Ordenando as jobs por um array pela ordem da criação em ordem do mais novo pro mais velho
            .then(jobs => {
                res.render('index', { jobs }) //renderizando a view com as jobs dentro dela

            })
            .catch(err => {
                console.log(err)
            })
    } else {
        Job.findAll({
            where: { title: { [Op.like]: query } },
            order: [
                ['createdAt', 'DESC']]
        }) //Ordenando as jobs por um array pela ordem da criação em ordem do mais novo pro mais velho
            .then(jobs => {
                res.render('index', { jobs, search }) //renderizando a view com as jobs dentro dela

            })
            .catch(err => {
                console.log(err)
            })
    }


})
// jobs routs
app.use('/jobs', require('./routs/jobs'))