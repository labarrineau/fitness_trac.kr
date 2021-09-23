
const { client } = require('./client');


async function getRoutineActivityById(id) {
    try {
 
        const { rows: [routineActivity]  } = await client.query(`
        SELECT *
        FROM routine_activities
        WHERE id=$1;
        `, [ id ]);

        return routineActivity;
    } catch (error) {
      throw error;
    }
  };


async function addActivityToRoutine({ routineId, activityId, count, duration }){
    try{

      const { rows: [ addedActivity ] } = await client.query(
          `INSERT INTO routine_activities ("routineId", "activityId", count, duration)
            VALUES ($1 , $2, $3, $4)
            ON CONFLICT ("routineId", "activityId") DO NOTHING
            RETURNING *;
          `, [routineId, activityId, count, duration]);

      return addedActivity;
    } catch (error){
        throw error;
    }       
};


async function updateRoutineActivity({ id, count, duration }){
    try{
      const updateObj = {}
      const checkFields = { count, duration };
      for ( const column in checkFields){
        if (checkFields[column] !== undefined){
          updateObj[column] = checkFields[column]
        }
      }
      const insert = Object.keys(updateObj).map(
        (key, index) => `"${key}" = $${index +1}`).join(', ');
      
      const { rows: [updatedRoutineActivity] } = await client.query(
          `UPDATE routine_activities
            SET ${ insert } 
            WHERE id = ${id}
            RETURNING *;
          `, Object.values(updateObj));

      return updatedRoutineActivity;
    } catch (error){
        throw error;
    }
};


async function destroyRoutineActivity(id){
    try{
      const { rows: [routineActivity] } = await client.query(`
        DELETE FROM routine_activities
        WHERE id = $1
        RETURNING *;
        `, [ id ]);
      return routineActivity;
    } catch (error){
        throw error;
    }
};


async function getRoutineActivitiesByRoutine({ id }){
    try{
        const { rows } = await client.query(`
        SELECT *
        FROM routine_activities
        WHERE "routineId" = $1
        `, [ id ]);
        return rows;
    } catch (error){
        throw error ;
    }
};

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity
}