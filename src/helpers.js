const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const archivoUsuarios = path.join(__dirname, './usuarios.json');

usuarios = []

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