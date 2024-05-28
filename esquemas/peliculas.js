const z = require('zod')    //libreria para las validaciones

//SEGUN EL CONCEPTO DE MIDU. UNA API DEBE RECIBR DE TODO PERO SOLO PROCESAR Y VALIDAR LO QUE
//LE INTERESA A LA API.

//SI ENVIAN POR EJEMPLO UNA INYECCION DE CODIGO, QUE LA IGNORE, PERO QUE NO SE GENERE UN ERROR 
//POR ESO.
//crear un esquema para las validaciones
const esquemaPelicula = z.object({
    title: z.string({
        invalid_type_error: ' El titulo debe ser una cadena de caracteres',
        required_error: 'El titulo es requerido'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster debe ser una URL Válida'
    }),
    genre: z.array(
        z.enum(['Action','Adventure','Comedy','Drama','Terror','Sci-Fi']),
        {
            required_error: 'El género de la Pelicula es obligatorio',
            invalid_type_error: 'El genero ingresado no es válido'
        }
    )
})

function validarPelicula(object){
    return esquemaPelicula.safeParse(object)
}

function validarParcialPelicula(object){
    //validar parcialmente. lo que el usuario este enviando a actualizar. si no envia nada no pasa
    //nada. si envia solo un dato para actualizar, lo valida, actualiza solo ese dato y el resto lo ignora
    //para eso es partial
    return esquemaPelicula.partial().safeParse(object);
}

module.exports= {
    validarPelicula,
    validarParcialPelicula
}