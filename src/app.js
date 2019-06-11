const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
app.set('views', path.join(__dirname, '../template/views'));
const directoriopartials = path.join(__dirname, '../template/partials');
app.use(express.static(directoriopublico));
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/',(req, res) => {

	res.render('index')
})

app.get('/register',(req, res) => {
    res.render('register')
})

app.post('/registrarUsuario', (req, res) => {
    res.render('registrarUsuario', {
        documento: req.body.documento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono,
        tipo: req.body.tipo
    })
})

app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})

app.get('*', (req, res) => {
	res.render('error')
})