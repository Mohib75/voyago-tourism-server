const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gs81nyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
})

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		// await client.connect()

		const touristsSpotCollection = client.db("touristsDB").collection("touristsSpot")

		const countryCollection = client.db("touristsDB").collection("country")

		app.get("/touristsSpot", async (req, res) => {
			const cursor = touristsSpotCollection.find()
			const result = await cursor.toArray()
			res.send(result)
		})

		app.get("/touristsSpot/:id", async (req, res) => {
			const id = req.params.id
			const query = { _id: new ObjectId(id) }
			const result = await touristsSpotCollection.findOne(query)
			res.send(result)
		})

		app.get("/myList/:email", async (req, res) => {
			const cursor = touristsSpotCollection.find({ email: req.params.email })
			const result = await cursor.toArray()
			res.send(result)
		})

		app.get("/country", async (req, res) => {
			const cursor = countryCollection.find()
			const result = await cursor.toArray()
			res.send(result)
		})

		app.get("/country/:country_name", async (req, res) => {
			const cursor = touristsSpotCollection.find({ country_name: req.params.country_name })
			const result = await cursor.toArray()
			res.send(result)
		})

		app.post("/touristsSpot", async (req, res) => {
			const newTouristsSpot = req.body
			const result = await touristsSpotCollection.insertOne(newTouristsSpot)
			res.send(result)
		})

		app.post("/country", async (req, res) => {
			const newCountry = req.body
			const result = await countryCollection.insertOne(newCountry)
			res.send(result)
		})

		app.put("/touristsSpot/:id", async (req, res) => {
			const id = req.params.id
			const filter = { _id: new ObjectId(id) }
			const options = { upsert: true }
			const updatedSpot = req.body
			const Spot = {
				$set: {
					spot_name: updatedSpot.spot_name,
					country_name: updatedSpot.country_name,
					image: updatedSpot.image,
					location: updatedSpot.location,
					description: updatedSpot.description,
					seasonality: updatedSpot.seasonality,
					travel_time: updatedSpot.travel_time,
					average_cost: updatedSpot.average_cost,
					total_visitors_per_year: updatedSpot.total_visitors_per_year,
				},
			}

			const result = await touristsSpotCollection.updateOne(filter, Spot, options)
			res.send(result)
		})

		app.delete("/touristsSpot/:id", async (req, res) => {
			const id = req.params.id
			const query = { _id: new ObjectId(id) }
			const result = await touristsSpotCollection.deleteOne(query)
			res.send(result)
		})

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 })
		console.log("Pinged your deployment. You successfully connected to MongoDB!")
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close()
	}
}
run().catch(console.dir)

app.get("/", (req, res) => {
	res.send("Voyago server is running")
})

app.listen(port, () => {
	console.log(`Voyago Server is running on port: ${port}`)
})
