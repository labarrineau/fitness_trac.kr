//ROUTINE_ACTIVITIES ROUTERS

const express = require ('express');

const routine_activitiesRouter = express.Router();
const { requireUser} = require('./utils');

const {
    getRoutineActivityById,
    destroyRoutineActivity,
    updateRoutineActivity,
    getRoutineById
} = require ('../db');



// PATCH /routine_activities/:routineActivityId 
routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) =>{
    try{

        const routine_activity = await getRoutineActivityById(req.params.routineActivityId)
        const routine = await getRoutineById(routine_activity.routineId)
        if(routine.creatorId === req.user.id) {
            const updatedRoutineActivity = await updateRoutineActivity({id: req.params.routineActivityId, count: req.body.count, duration: req.body.duration});
            res.send(updatedRoutineActivity);
        } else {
            next({
                name: "NotAuthorizedError",
                message: "Must be authorized to update routine activity"
            })
        }

    }catch({name, message}){
       next({name, message});
    }
});


// DELETE /routine_activities/:routineActivityId 
routine_activitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
      const routine_activity = await getRoutineActivityById(req.params.routineActivityId)
      const routine = await getRoutineById(routine_activity.routineId)
      if(routine.creatorId === req.user.id) {
          const destroyedRoutineActivity = await destroyRoutineActivity(req.params.routineActivityId);
          res.send(destroyedRoutineActivity)
      } else {
          next({
              name: "NotAuthorizedError",
              message: "Must be authorized to update routine activity"
          })
      }
     
    } catch (error) {
        next (error)
    }
});


module.exports = routine_activitiesRouter;