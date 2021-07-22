const path = require("path");
const app = require("express").Router();
const db = require('../models')
    
// Routes

// ----------------------------------------------------------------------------------------------------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/exercise', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/exercise.html'));
});

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/stats.html'));
});

// ----------------------------------------------------------------------------------------------------

app.get('/api/workouts', (req, res) => {
    db.Workout.find({})
        .sort({ day: -1 })
        .then(workoutDB => {
            // console.log(workoutDB);
            res.json(workoutDB);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

app.put('/api/workouts/:id', (req, res) => {
    db.Workout.findOneAndUpdate(
        { _id: req.params.id },
        {
            $push: {
            exercises: req.body
            }
        }
    )
    .then(workoutDB => {
        res.json(workoutDB);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

app.post('/api/workouts/', (req, res) => {
    db.Workout.create(req.body)
        .then(workoutDB => {
            res.json(workoutDB)
        }).catch(err => {
            res.status(400).json(err);
        });
});

app.get('/api/workouts/range', (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: '$exercises.duration' }
            }
        }
    ])
    .sort({ _id: -1 })
    .limit(7)  
        .then(workoutDB => {
            console.log(workoutDB);
            res.json(workoutDB);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

// ----------------------------------------------------------------------------------------------------

module.exports = app;