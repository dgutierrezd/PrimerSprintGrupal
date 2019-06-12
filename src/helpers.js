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
    listarUsuarios()

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
    listarCursos()

    let texto = '';
    listaCursos.forEach(curso => {
        texto = texto + 
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                    <p class="card-text">${curso.descripcion}</p>`
                    if(curso.estado == 'Disponible') {
                        texto = texto + `<a href="/cerrarCurso?id=${curso.id}">Cerrar Curso</a>`
                    } else 
                        texto = texto + `<a href="/abrirCurso?id=${curso.id}">Abrir Curso</a>`
                    texto = texto + `<a href="/estudiantesInscritos?id=${curso.id}" class="btn btn-secondary">Ver Inscritos</a>
                    </div>
                </div>
            </div>`
    });
    return texto;
})

hbs.registerHelper('cerrarCurso', idCurso => {
    listarCursos()

    var registro = listaCursos.find(curso => curso.id === idCurso);
    registro.estado='Cerrado';
    guardarCursos();
    return 'Curso cerrado.';
})

hbs.registerHelper('abrirCurso', idCurso => {
    listarCursos()

    var registro = listaCursos.find(curso => curso.id === idCurso);
    registro.estado = 'Disponible';
    guardarCursos();
    return 'Curso disponible.';
})

hbs.registerHelper('estudiantesInscritos', idCurso => {
    listarEstudiantes()

    let texto = '';
    listaEstudiantes.forEach(estudiante => {
        if(estudiante.idCurso === idCurso) {
            texto = texto + 
                `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${estudiante.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${estudiante.documento}</h6>
                        <p class="card-text">E-mail: ${estudiante.correo}</p>
                        <p class="card-text">Tel: ${estudiante.telefono}</p>
                        <a href="/estudianteEliminado?documento=${estudiante.documento}&id=${idCurso}" class="btn btn-danger">Eliminar estudiante</a>
                        </div>
                    </div>
                </div>`
        }
    });
    return texto;
})

hbs.registerHelper('registrarCurso', (id, nombre, descripcion, valor) => {
    listarCursos()
    
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
    })
}

const guardarInscripciones = () => {
    let datos = JSON.stringify(listaEstudiantes);
    
    fs.writeFile(archivoEstudiantes, datos, (err) => {
        if(err) throw (err);
    })
}

hbs.registerHelper('listarCursosAspirante', documento => {
    listarCursos()
    listarEstudiantes()

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
                                <a href="/eliminarCurso?id=${curso.id}&documento=${documento}" class="btn btn-primary">Eliminar de Mis Cursos</a>
                                </div>
                            </div>
                        </div>`
                }
            })
        } 
    });
    return texto;
})

hbs.registerHelper('listarUsuarios', () => {
    listarUsuarios()

    let texto = '';
    usuarios.forEach(usuario => {
        texto = texto + 
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${usuario.nombre} - ${usuario.tipo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">N° de Documento: ${usuario.documento}</h6>
                    <p class="card-text">Correo electrónico: ${usuario.correo}</p>
                    <p class="card-text">Teléfono: ${usuario.telefono}</p>`
                    if(usuario.tipo == 'aspirante') 
                        texto = texto + `<a href="/rolDocente?documento=${usuario.documento}" class="btn btn-warning">Cambiar rol a Docente</a>`
                    else 
                        if(usuario.tipo == 'docente')
                            texto = texto + `<a href="/rolAspirante?documento=${usuario.documento}" class="btn btn-warning">Cambiar rol a Aspirante</a>`
                    texto = texto + `</div>
                </div>
            </div>`
    });
    return texto;
})

hbs.registerHelper('pasarADocente', documento => {
    listarUsuarios()

    var registro = usuarios.find(user => user.documento === documento);
    registro.tipo = 'docente';
    guardarUsuarios()
    return `El usario con documento ${documento} ya es docente.`;
})

hbs.registerHelper('pasarAAspirante', documento => {
    listarUsuarios()

    var registro = usuarios.find(user => user.documento === documento);
    registro.tipo = 'aspirante';
    guardarUsuarios()
    return `El usario con documento ${documento} ya es aspirante.`;
})

hbs.registerHelper('estudianteEliminado', (documento, id) => {
    listarEstudiantes()

    let query = {documento: documento, idCurso: id};

    let result = listaEstudiantes.filter(search, query);
    
    listaEstudiantes = result;
    guardarInscripciones();
    return id;
})

hbs.registerHelper('cursoEliminado', (documento, id) => {
    listarEstudiantes()

    let query = {documento: documento, idCurso: id};

    let result = listaEstudiantes.filter(search, query);
    
    listaEstudiantes = result;
    guardarInscripciones();
    return documento;
})

function search(user){
    return Object.keys(this).every((key) => user[key] !== this[key]);
}

hbs.registerHelper('listarCursosInscribir', () => {
    listarCursos()

    let texto = '';
    listaCursos.forEach(curso => {
        if(curso.estado == 'Disponible') {
            texto = texto + 
                `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                        <p class="card-text">${curso.descripcion}</p>
                        <a href="/inscribir?id=${curso.id}" class="btn btn-primary">Inscribirse</a>
                        </div>
                    </div>
                </div>`
        }
    });
    return texto;
})

hbs.registerHelper('inscribir', id => {
    listarCursos()

    let texto = '';
    listaCursos.forEach(curso => {
        if(curso.id == id) {
            texto = texto +
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                    <p class="card-text">${curso.descripcion}</p>
                    </div>
                </div>
            </div>`
        }
    })
    return texto;
}) 

hbs.registerHelper('registrarInscripcion', ( idCurso, documento, nombre, correo, telefono) => {
    listarEstudiantes()

    var existe = listaEstudiantes.filter(curso => curso.idCurso === idCurso && curso.documento === parseInt(documento));
        
    if(existe.length <= 0) {
        let estudiante = {idCurso:idCurso, documento:parseInt(documento), nombre:nombre, correo:correo, telefono:telefono}
        listaEstudiantes.push(estudiante);
        guardarInscripciones();
        return `El estudiante con el número de documento ${documento} se ha registrado exitosamente.`;
    }else
        return `La persona con número de documento ${documento} ya se encuentra registrada en este curso.`;

})

const listarEstudiantes = () => {
    try {
		listaEstudiantes = JSON.parse(fs.readFileSync(archivoEstudiantes));
	} catch(error) {
		listaEstudiantes = []
	}
}

const listarCursos = () => {
    try {
		listaCursos = JSON.parse(fs.readFileSync(archivoCursos));
	} catch(error) {
		listaCursos = []
	}
}

const listarUsuarios = () => {
    try {
		usuarios = JSON.parse(fs.readFileSync(archivoUsuarios));
	} catch(error) {
		usuarios = []
	}
}

const ingresarCoord  = usuario => {
    listarUsuarios()

    if(usuarios.find(user => (user.documento == usuario.username && user.documento == usuario.contrasena) && user.tipo == 'coordinador'))
        return true;        
    else
        return false;
}

hbs.registerHelper('listarCursosInteresado', () => {
    listarCursos()

    let texto = '';
    listaCursos.forEach(curso => {
        if(curso.estado == 'Disponible') {
            texto = texto + 
                `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                        <p class="card-text">${curso.descripcion}</p>
                        </div>
                    </div>
                </div>`
        }
    });
    return texto;
})

const ingresarAsp  = usuario => {
    listarUsuarios()

    if(usuarios.find(user => (user.documento == usuario.username && user.documento == usuario.contrasena) && user.tipo != 'coordinador'))
        return true;        
    else
        return false;
}

module.exports = {
    ingresarCoord,
    ingresarAsp
}