const express = require('express')
const mongoos = require('mongoose')
require('dotenv').config()
const { Schema, model } = require('mongoose')
const routes = express.Router()

// initier serveur 
const app = express()
const port = process.env.PORT

// connecter lq bqse de donnees 
mongoos.connect(process.env.URL, {
  dbName : process.env.DBNAME
}).then(() => {
  console.log('App is connected to mongodb');
}).catch((err) => {
  console.log(err)
})

// creation de Model de bese de donnees :

const recetteSchema = new Schema({
  // model
  name: String,
  origin: String,
  ingredient: [String],
  votes : Number
})

// Gestion des middleWire :
app.use(express.json())

const RcetteModel = model('Recette',recetteSchema)

// Gestion des routes GET  :
routes.get('/recette', async (req,res) => {
  try {
    const getRecette = await RcetteModel.find()
    return res.json({
      data : getRecette
    })
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
})

// GET BY ID

routes.get('/recette/:id', async (req, res) => {
  const {id} = req.params
  try {
    const getOneElement = await RcetteModel.findById({ _id: id })
    
    return res.json({
      data : getOneElement
    })

  } catch (error) {
    error : error.message
  }
})

// GESTION DES ROUTES POST"

routes.post('/recette', async (req, res) => {
  const {name,origin,ingredient,votes} = req.body
  try {
    const addRecette = await RcetteModel.create({
      name,origin,ingredient,votes
    })

    return res.json({
      data : addRecette
    })

  } catch (error) {
    return res.json({
      error : error.message
    })
  }
})

// Modification with PUT

routes.put('/recette/:id', async (req, res) => {
  // 1 get the data i need to update a recepy from the front in these case is the id of recepy that i want updte and the new data = put > req
  const { id } = req.params
  const { name, origin, ingredient,votes } = req.body
  try {
    // 2 communicate with thw base in these th db want the id and the new data 
    const getOneRecette = await RcetteModel.findByIdAndUpdate({_id: id}, { name, origin, ingredient,votes })
    return res.json({
      data : getOneRecette
    })
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
})


// DELETE :

routes.delete('/recette/:id', async (req, res) => {
  const { id } = req.params
  // const myId = req.params.id
  try {
    const deleteRecette = await RcetteModel.findByIdAndDelete({
      _id: id
      // _id : myId
    })
    return res.json({
      data: deleteRecette,
      message : "Your recepy is deleted successfully"
    })

  } catch (error) {
    error : error.message 
  }

})

app.use('/', routes)

const server = app.listen(port, () => {
  console.log('Hello from the server ' + port);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});