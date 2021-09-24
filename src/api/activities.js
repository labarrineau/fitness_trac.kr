// ACTIVITIES ROUTERS

const express = require ('express');
const activitiesRouter = express.Router();

const { getAllActivities,
        createActivity,
        updateActivity,
        getPublicRoutinesByActivity } = require('../db');



// GET /activities
activitiesRouter.get('/', async ( req, res, next ) => {
    try{
        const allActivities = await getAllActivities();
        res.send( allActivities );
    } catch({ name, message }){
      next({ name, message });
    }
    });
 

// POST /activities
activitiesRouter.post('/', async (req, res, next) => {
    try {
        const activity = await createActivity(req.body);

        res.send( activity );

    } catch ({ name, message }) {
        next({ name, message });
    }
});


// PATCH /activities/:activityId    
activitiesRouter.patch('/:activityId', async (req, res, next) => {
    try {
        const updatedActivity = await updateActivity({ id:req.params.activityId, 
                                                        name: req.body.name, 
                                                        description: req.body.description });
        res.send( updatedActivity )
    } catch ({ name, message }) {
        next({ name, message });
    }
});


// GET /activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async ( req, res, next ) => {
    try{
        const allActivities = await getPublicRoutinesByActivity({id:req.params.activityId});
        res.send( allActivities );
    } catch({ name, message }){
        next({ name, message });
    }
});


module.exports = activitiesRouter;