const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const helpers = require('./helpers');

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

app.post('/coordinador', (req, res) => {

    let usuario = {
        username: req.body.username,
        contrasena: req.body.contrasena
    }

    let ingreso = helpers.ingresarCoord(usuario)
    if(ingreso) {
        res.render('coordinador')
    } else {
        res.render('index', {
            respuestaCoord: 'El usuario o la contraseña son incorrectos.'
        })
    }
})

app.post('/aspirante', (req, res) => {
    let usuario = {
        username: req.body.username,
        contrasena: req.body.contrasena
    }

    let ingreso = helpers.ingresarAsp(usuario)
    if(ingreso) {
        res.render('aspirante')
    } else {
        res.render('index', {
            respuestaAsp: 'El usuario o la contraseña son incorrectos.'
        })
    }
})

app.get('/coordinador/index', (req, res) => {
    res.render('coordinador')
})

app.get('/coordinador/cursos', (req, res) => {
    res.render('cursosCoordinador')
})

app.get('/coordinador/crear', (req, res) => {
    res.render('crearCoordinador')
})

app.post('/creacionCurso',(req, res) => {
	
	res.render('creacionCurso', {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor:req.body.valor,
        estado:req.body.estado
	});
})

app.get('/aspirante/index', (req, res) => {
    res.render('aspirante')
})

app.get('/aspirante/cursos', (req, res) => {
    res.render('cursosAspirante')
})

app.post('/aspirante/verCursos', (req, res) => {
    res.render('verCursosAspirante', {
        documento: req.body.documento
    })
})

app.get('/aspirante/inscribir', (req, res) => {
    res.render('inscribirAspirante')
})

app.get('/estudianteEliminado', (req, res) => {
    res.render('estudianteEliminado', {
        documento: req.query.documento,
        id: req.query.id
    })
})

app.get('/eliminarCurso', (req, res) => {
    res.render('cursoEliminado', {
        documento: req.query.documento,
        id: req.query.id
    })
})

app.post('/registrarInscripcion', (req, res) => {
    res.render('registrarInscripcion', {
        idCurso: req.body.idCurso,
        documento: req.body.documento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    })
})

app.get('/inscribir', (req,res) => {
    res.render('inscribir', {
        id:req.query.id
    })
})

app.get('/estudiantesInscritos', (req, res) => {
    res.render('estudiantesInscritos', {
        id:req.query.id
    })
})

app.get('/cerrarCurso', (req, res) => {
    res.render('cerrarCurso', {
        id: req.query.id
    })
})

app.get('/abrirCurso', (req, res) => {
    res.render('abrirCurso', {
        id: req.query.id
    })
})

app.get('/estudianteEliminado', (req, res) => {
    res.render('estudianteEliminado', {
        documento: req.query.documento,
        id: req.query.id
    })
})

app.get('/coordinador/gestion', (req, res) => {
    res.render('gestionCoordinador')
})

app.get('/rolDocente', (req, res) => {
    res.render('rolDocente', {
        documento: req.query.documento
    })
})

app.get('/rolAspirante', (req, res) => {
    res.render('rolAspirante', {
        documento: req.query.documento
    })
})

app.get('/interesado', (req, res) => {
    res.render('interesado')
})

app.get('/interesado/cursos', (req, res) => {
    res.render('cursosInteresado')
})

app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})

app.get('*', (req, res) => {
	res.render('error')
})