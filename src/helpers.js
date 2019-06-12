const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const archivoUsuarios = path.join(__dirname, './usuarios.json');
const archivoCursos = path.join(__dirname, './listadoCursos.json');
const archivoEstudiantes = path.join(__dirname, './listaEstudiantes.json');

usuarios = []
listaCursos = []
listaEstudiantes = []

hbs.registerHelper('registrarUsuario', (documento, nombre, correo, telefono, tipo) => {
    usuarios = require(archivoUsuarios);

    if(!usuarios.find(usuario => usuario.documento == parseInt(documento))) {
        let usuario = {documento: documento, nombre: nombre, correo: correo, telefono: telefono, tipo: tipo}
        usuarios.push(usuario);
        guardarUsuarios();
        return `El usuario se ha registrado exitosamente.`;
    } else
        return 'El documento del usuario ya se encuentra registrado :(';
})

const guardarUsuarios = () => {
    let datos = JSON.stringify(usuarios);
    
    fs.writeFile(archivoUsuarios, datos, (err) => {
        if(err) throw (err);
        console.log('Archivo creado con exito');
    })
}

hbs.registerHelper('respuestaAlertCoord', (respuestaCoord) => {
    if(!respuestaCoord) {
        return ''
    }
    else {
        return `<div class="alert alert-danger" role="alert">
                    ${respuestaCoord}
                </div>`
   }    
})

hbs.registerHelper('listarCursosCoordinador', () => {
    listaCursos = require(archivoCursos);
    let texto = '';
    listaCursos.forEach(curso => {
        texto = texto + 
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                    <p class="card-text">${curso.descripcion}</p>
                    <a href="/cerrarCurso?id=${curso.id}">Cerrar Curso</a>
                    <a href="/estudiantesInscritos?id=${curso.id}" class="btn btn-secondary">Ver Inscritos</a>
                    </div>
                </div>
            </div>`
    });
    return texto;
})

hbs.registerHelper('registrarCurso', (id, nombre, descripcion, valor) => {
    listaCursos = require(archivoCursos);
    
    if(!listaCursos.find(curso => curso.id == parseInt(id))) {
        let curso={id:id, nombre:nombre, descripcion:descripcion, valor:valor, estado:'Disponible'}
        listaCursos.push(curso);
        guardarCursos();
        return `El curso de ${nombre} se ha creado exitosamente.`;
    } else
        return 'El id del curso ya se encuentra registrado :(';
})

hbs.registerHelper('respuestaAlertAsp', (respuestaAsp) => {
    if(!respuestaAsp) {
        return ''
    }
    else {
        return `<div class="alert alert-danger" role="alert">
                    ${respuestaAsp}
                </div>`
   }    
})

const guardarCursos = () => {
    let datos = JSON.stringify(listaCursos);
    
    fs.writeFile(archivoCursos, datos, (err) => {
        if(err) throw (err);
        console.log('Archivo creado con exito');
    })
}

hbs.registerHelper('listarCursosAspirante', documento => {
    listaCursos = require(archivoCursos);
    listaEstudiantes = require(archivoEstudiantes);

    let texto = '';
    listaEstudiantes.forEach(estudiante => {
        if(estudiante.documento == documento) {
            listaCursos.forEach(curso => {
                if(curso.id == estudiante.idCurso) {
                    texto = texto + 
                        `<div class="col-sm-12">
                            <div class="card">
                                <div class="card-body">
                                <h5 class="card-title">${curso.nombre}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                                <p class="card-text">${curso.descripcion}</p>
                                <a href="/eliminarCurso?id=${curso.id}" class="btn btn-primary">Eliminar de Mis Cursos</a>
                                </div>
                            </div>
                        </div>`
                }
            })
        } else {
            texto +=
            `<div class="text-center>
                <h4>No tienes cursos inscritos.</h4>
            </div>`
        }
    });
    return texto;
})

const ingresarCoord  = usuario => {
    usuarios = require(archivoUsuarios);

    if(usuarios.find(user => (user.documento == usuario.username && user.documento == usuario.contrasena) && user.tipo == 'coordinador'))
        return true;        
    else
        return false;
}

const ingresarAsp  = usuario => {
    usuarios = require(archivoUsuarios);

    if(usuarios.find(user => (user.documento == usuario.username && user.documento == usuario.contrasena) && user.tipo == 'aspirante'))
        return true;        
    else
        return false;
}

module.exports = {
    ingresarCoord,
    ingresarAsp
}