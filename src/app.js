//BACKEND

import express from 'express'
import routerProd from './routes/product.js'
import routerCart from "./routes/cart.js"
import routerSocket from './routes/socket.js'
import {__dirname} from './path.js'
import {engine}  from 'express-handlebars'
import * as path from 'path' //importame todo de el archivo path
import {Server} from 'socket.io' //importo sockets





const app = express()
const PORT = 8080

const server = app.listen(PORT,()=> { 
    console.log (`server on port ${PORT}`) 
})

const io = new Server(server) //guardo mi server en socket



//Middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 
app.engine("handlebars",engine()) // para poder utilizar las handlebars que estan dentro de la carpeta view
app.set("view engine","handlebars") //defino que mis views son archivos handlebars
app.set('views',path.resolve(__dirname , './views')) //concateno 2 rutas


//routes
app.use('/',express.static(__dirname + '/public')) 

app.use('/api/products',routerProd) 

app.use('/api/carts',routerCart)

app.use('/',routerSocket)

const mensajes = []
io.on('connection', (socket) => {  //CUANDO ALGUIEN SE CONECTE
    console.log("usuario conectado")
    socket.on('mensaje', info => { //recibo la informacion del que generamos (socket.emit - "mensaje") en main.js con socket.on , mas precisamente la del input que esta en main.handlebars
        mensajes.push(info) //mando la informacion que recibimos a un array vacio
        io.emit('mensajesLogs',mensajes) //lo imprimo en la etiqueta "p" de mi html
    })
}) 



/*
app.get('/static',(req,res) => {
    
    const user = {
        nombre: "seba",
        mail: "seba@seba.com",
        rol: "tutor"
    } //creo una variable y la renderizo en "home" , declarandola como user:user
    
    const cursos = [
        {numComision: 44555,dias: "Lunes y miercoles",   horario: "20:00 a 22:00"},
        {numComision: 42255,dias: "Martes y jueves",   horario: "19:00 a 21:00"}
    ]
    
    res.render('home', {
        titulo: "Coder",
        mensaje: "Mundo",
        isTutor: user.rol === "tutor", //hago la consulta de si es verdadero aca y no en el archivo handlebars
        user,
        cursos
    }
)})//dentro de render va el componente html que queremos renderizar. Luego , modificamos los objetos creados en main y home como esta escrito arriba
//podemos crear mas app.get(/) res.reder('contacto') y demas para consultar otros archivos

//conexion socket
io.on('connection', (socket) => { //socket.on - captura informacion que le llega. io.emit envio de informacion
    console.log('conexion en socket')

    socket.on('mensaje', info => { //captura de info de cliente
        console.log(info)

        socket.broadcast.emit('evento-admin',"Hola desde server sos el admin") //se va a poder escuchar en mi app menos en el socket actual
        socket.emit('evento-general', 'hola a todos los usuarios')
    })
}) //cuando se realice una conexion a mi servidor se ejecute una funcion con el socket como parametro para poder implementarlo



*/


