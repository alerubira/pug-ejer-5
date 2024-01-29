const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/noticias', (req, res) => {
    const noticias = obtenerNoticias();
    res.render('noticias', { noticias });
});

app.get('/noticias/insertar', (req, res) => {
    const categorias = obtenerCategorias();
    res.render('insertar', { categorias });
});

app.post('/noticias/agregar', (req, res) => {
    const { titulo, descripcion, categoria, fecha, url_imagen } = req.body;
    const nuevaNoticia = { titulo, descripcion, categoria, fecha, url_imagen };
    agregarNoticia(nuevaNoticia);
    res.redirect('/noticias');
});

/*app.get('/noticias/borrar/:id', (req, res) => {
    const idNoticia = req.params.id;
    borrarNoticia(idNoticia);
    res.redirect('/noticias');
});*/
// ...

app.get('/noticias/borrar/:id', (req, res) => {
    const idNoticia = req.params.id;
    
    // Verificar si el ID es un número entero
    if (!Number.isInteger(parseInt(idNoticia))) {
        return res.status(400).send('El ID de la noticia no es válido');
    }

    const noticias = obtenerNoticias();

    // Verificar si el ID está dentro del rango de índices del array
    if (idNoticia < 0 || idNoticia >= noticias.length) {
        return res.status(404).send('Noticia no encontrada');
    }

    borrarNoticia(parseInt(idNoticia));
    res.redirect('/noticias');
});

// ...


// Funciones de utilidad
function obtenerNoticias() {
    const noticiasRaw = fs.readFileSync('noticias.txt', 'utf8');
    return noticiasRaw.split('\n').filter(Boolean).map(JSON.parse);
}

function agregarNoticia(nuevaNoticia) {
    const noticias = obtenerNoticias();
    noticias.push(nuevaNoticia);
    fs.writeFileSync('noticias.txt', noticias.map(JSON.stringify).join('\n'));
}

function borrarNoticia(idNoticia) {
    const noticias = obtenerNoticias();
    noticias.splice(idNoticia, 1);
    fs.writeFileSync('noticias.txt', noticias.map(JSON.stringify).join('\n'));
}

function obtenerCategorias() {
    return [
        'Arte',
        'Actualidad',
        'Deporte',
        'Política',
        'Mundo',
        'Espectáculos',
        'Ciencia'
    ];
}

// Inicia el servidor
app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
