const express = require('express')
const router = express.Router()
const Job = require('../models/Job')
router.get('/test', (req, res) => {
    res.send('deu certo')
})

// detalhe da vaga ->view/1, view/2
router.get('/view/:id', (req, res) => Job.findOne({
    where: { id: req.params.id }
}).then(job => {
    res.render('view', { job })
}).catch(err => console.log(err))

)

// form da rota de envio
router.get('/add', (req, res) => {
    res.render('add')
})

//add job via post
router.post('/add', (req, res) => {
    //receber um corpo com todos os dados (titulo, salario...) necessarios para adicionar no banco
    let { title, salary, company, description, email, new_job } = req.body

    //insert para inserir dados no sistema
    Job.create({
        title,
        description,
        salary,
        company,
        email,
        new_job
    })
        //Isso vai redirecionar a pagina para home apos adicionar a vaga
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

module.exports = router
