const express= require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json');
const { validarPelicula, validarParcialPelicula } = require('./esquemas/peliculas');

const app= express();
app.use(cors());

app.get('/', (req,res) => {
    res.send('<h1>Pagina de Inicio</h1>');
})

app.use(express.json()) //middleware para que pueda accederse al body en la petición POST

app.get('/movies', (req,res) =>{
    const { genre } = req.query
    if (genre){
        //toLowercase para que no importe si lo escriben en minuscla o mayuscula
        const filtroPelis= movies.filter(movie=> movie.genre.some(g=>g.toLowerCase()===genre.toLowerCase()))
        return res.json(filtroPelis)
    }
    res.json(movies)
})

app.get('/movies/:id', (req,res) => {
    const { id } = req.params;
    const movie= movies.find( movie => movie.id ===id)
    if (movie) return res.json(movie)
    res.status(404).json( { Message: 'Movie not found'})
})

app.post('/movies', (req,res) => {
    
    const resultado = validarPelicula(req.body)
    if (resultado.error){
        return res.status(400).json({ error: JSON.parse(resultado.error.message)})
    }

    const newMovie= {
            id: crypto.randomUUID(),  //uuid version 4
            ...resultado.data
        }
        //esto no sería REST proque se está almacenando en memoria
        movies.push(newMovie)
        //indicar que se creó el recurso
        res.status(201).json(newMovie)
})


app.patch('/movies/:id', (req,res) => {
    
    const result=validarParcialPelicula(req.body)
    if(!result.success){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    
    const { id } = req.params;
    const movieIndex= movies.findIndex(movie => movie.id === id)

    if (movieIndex===-1){
        return res.status(404).json({message: "Pelicula no Encontrada"})
    }

    const updateMovie= {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex]=updateMovie
    return res.json(updateMovie)
})

PORT=process.env.PORT ?? 3000

app.listen(PORT, ()=> {
    console.log('Escuchando en el puerto ' , PORT)
})