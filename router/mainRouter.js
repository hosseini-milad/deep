
const brain = require('brain.js')
const TrainStream = require('train-stream');
const express = require('express');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
 
const auth = require("../middleware/auth");

const reportApi=async(req,res)=>{
    const config = {
        binaryThresh: 0.5,
        hiddenLayers: [2,2], // array of ints for the sizes of the hidden layers in the network
        activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
        leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
      };

      const restaurants = {
        "Brilliant Yellow Corral": "Monday",
        "Penny’s": "Tuesday",
        "Right Coast Wings": "Wednesday",
        "The Delusion Last Railway Car": "Thursday",
        "Fun Day Inn": "Friday",
        "JHOP": "Saturday",
        "Owls": "Sunday"
    };
    const trainingData = [];

    for (let restaurantName in restaurants) {
        const dayOfWeek = restaurants[restaurantName];
        trainingData.push({
            input: { [dayOfWeek]: 1 },
            output: { [restaurantName]: 1 }
        })
    }
    const net = new brain.NeuralNetwork({ hiddenLayers: [3] });

    const stats = net.train(trainingData);
    function restaurantForDay(dayOfWeek) {
        const result = net.run({ [dayOfWeek]: 1 });
        let highestValue = 0;
        let highestRestaurantName = '';
        for (let restuarantName in result) {
            if (result[restuarantName] > highestValue) {
                highestValue = result[restuarantName];
                highestRestaurantName = restuarantName;
            }
        }
        
        return highestRestaurantName;
    }
    try{
        res.json({
            Saturday:restaurantForDay('Saturday'),
            Sunday:restaurantForDay('Sunday'),
            Monday:restaurantForDay('Monday'),
            Tuesday:restaurantForDay('Tuesday'),
            Wednesday:restaurantForDay('Wednesday,'),
            Thursday:restaurantForDay('Thursday'),
            Friday:restaurantForDay('Friday')

        });
    }
    catch(error){
        res.json(error)
    }
}
router.get('/reports',reportApi)


module.exports = router;