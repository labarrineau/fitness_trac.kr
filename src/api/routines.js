//ROUTINE ROUTERS

const express = require ('express');
const routinesRouter = express.Router();
const { requireUser } = require('./utils');

const{
    getRoutineById,
    getRoutineActivitiesByRoutine,
    getAllPublicRoutines,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine
} = require ('../db');


// GET /routines
routinesRouter.get('/', async ( req, res, next ) => {
    try{
        const allPublicRoutines = await getAllPublicRoutines();
        
        res.send( allPublicRoutines );
    } catch({ name, message }){
      next({ name, message });
    }
    });


// POST /routines
routinesRouter.post('/', requireUser, async ( req, res, next ) => {
  console.log("ROUTINES", req.body, req.user)
    try{
        const newRoutine = await createRoutine({isPublic: req.body.isPublic, 
                                                name: req.body.name, 
                                                goal: req.body.goal,
                                                creatorId: req.user.id});
        res.send( newRoutine );       
    } catch({ name, message }){
        next({ name, message });
    }
    });


// PATCH /routines/:routineId 
routinesRouter.patch('/:routineId', async (req, res, next) => {
    try {
        const originalActivity = await getRoutineById( req.params.routineId );
    
        if (originalActivity.creatorId === req.user.id) {
            const updatedActivity = await updateRoutine({id: req.params.routineId, 
                                                          isPublic: req.body.isPublic, 
                                                          name: req.body.name, 
                                                          goal: req.body.goal });
          res.send( updatedActivity )
        } else {
          next({
            name: 'UnauthorizedUserError',
            message: 'You cannot update a activity that is not yours'
          })
        }
    } catch ({ name, message }) {
      next({ name, message });
    }
});


// DELETE /routines/:routineId
routinesRouter.delete('/:routineId', async (req, res, next) => {
    try {
      const routine = await getRoutineById(req.params.routineId);
  
      if (routine.creatorId === req.user.id) {
        const deletedRoutine = await destroyRoutine( req.params.routineId );
  
        res.send(deletedRoutine);
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a activity that is not yours'
        })
      };
        
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


// POST /routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    try {
            const {activityId,  count, duration } = req.body;
            const { routineId } = req.params;
            const foundRoutineActivities = await getRoutineActivitiesByRoutine({
                  id: routineId
                });
            const existingRoutineActivities = foundRoutineActivities.filter((routineActivity) => routineActivity.activityId === activityId);
            if (existingRoutineActivities.length > 0) {
                next({
                  name: 'RoutineActivityExistsError',
                  message: `A routine_activity by that routineId ${routineId}, activityId ${activityId} combination already exists.`,
                });
            } else {
                const createdRoutineActivity = await addActivityToRoutine({
                  routineId,
                  activityId,
                  count,
                  duration,
                });
              if (createdRoutineActivity) {
                  res.send(createdRoutineActivity);
              } else {
                next({
                  name: 'FailedToCreate',
                  message: `There was an error adding activity ${activityId} to routine ${routineId}`,
                });
              }}

    } catch ({ name, message }) {
      next({ name, message });
    }});


module.exports = routinesRouter;