
const { client } = require('./client');


//helper function
async function attachActivitiesToRoutines(routines) {
    const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
    const routineIds = routines.map((routine) => routine.id);
    try {
        const { rows: activities } = await client.query(`
                SELECT activities.*, ra.duration, ra.count, ra.id AS "routineActivityId",
                ra."routineId"
                FROM activities
                JOIN routine_activities AS ra ON ra."activityId" = activities.id
                WHERE ra."routineId" IN (${binds})
                `,routineIds);

          // loop over the routines
          for (const routine of routines) {
            // filter the activities to only include those that have this specific routineId
            const activitiesToAdd = activities.filter(
              (activity) => activity.routineId === routine.id,
            );
            // attach the activities to each single routine
            routine.activities = activitiesToAdd;
          }

        return routines;
    } catch (error) {}
}



async function getRoutineById(routineId) {
    try {
        const { rows: [ routine ]  } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=$1;
            `, [routineId]);
    
        if (!routineId) {
            throw {
              name: "RoutineNotFoundError",
              message: "Could not find a routine with that routineId"
            };
        }
        return routine;
    } catch (error) {
      throw error ;
    }
};


async function getRoutinesWithoutActivities(){
    try{
        const { rows: noActivityRoutines } = await client.query(`
          SELECT *
          FROM routines;
          `);

        return noActivityRoutines;
    } catch (error){
      throw error ;
    }
}


async function getAllRoutines(){
    try{
        const { rows:  routines } = await client.query(`
            SELECT routines.*,
                  username as "creatorName"
            FROM routines
            JOIN users
              ON routines."creatorId" = users.id;
            `)

        const { rows:  activities } = await client.query(`
            SELECT *
            FROM activities
            JOIN routine_activities
              ON routine_activities."activityId"= activities.id;
            `);

        for (const routine of routines) {
              const activitiesToAdd = activities.filter(
                (activity) => activity.routineId === routine.id,
              );
        routine.activities = activitiesToAdd;
        };

        return routines;
    } catch (error) {
      throw error ;
    }
};


async function getAllPublicRoutines(){
    try{
        const { rows:  routines } = await client.query(`
            SELECT routines.*,
                  username as "creatorName"
            FROM routines
            JOIN users
              ON routines."creatorId" = users.id
              WHERE routines."isPublic" = true;
            `)
    
        const { rows:  activities } = await client.query(`
              SELECT *
              FROM activities
              JOIN routine_activities
                ON routine_activities."activityId"= activities.id;
              `);
    
          for (const routine of routines) {
              const activitiesToAdd = activities.filter(
                  (activity) => activity.routineId === routine.id,
                );
          routine.activities = activitiesToAdd;
          };
          return routines;
    }catch (error) {
        throw error;
    }
};

async function getAllRoutinesByUser({ username }){

    try{
        const { rows:  routines } = await client.query(`
            SELECT routines.*,
                  username as "creatorName"
            FROM routines
            JOIN users
              ON routines."creatorId" = users.id
                WHERE users.username= $1 ;
                `, [ username ]);
        const { rows:  activities } = await client.query(`
            SELECT *
            FROM activities
            JOIN routine_activities
              ON routine_activities."activityId"= activities.id;
            `);

        for (const routine of routines) {
            const activitiesToAdd = activities.filter(
              (activity) => activity.routineId === routine.id,
            );
        routine.activities = activitiesToAdd;
        };
        return routines;

    } catch (error){
      throw error;
    }

};

async function getPublicRoutinesByUser({ username }) {
  try{

    const { rows:  routines } = await client.query(`
    SELECT routines.*,
          users.username as "creatorName"
    FROM routines
    JOIN users
      ON routines."creatorId" = users.id
         WHERE users.username = $1
          AND routines."isPublic" = true;
         `, [ username ]);
    const { rows:  activities } = await client.query(`
          SELECT *
          FROM activities
          JOIN routine_activities
            ON routine_activities."activityId"= activities.id;
    `);

    for (const routine of routines) {
            const activitiesToAdd = activities.filter(
            (activity) => activity.routineId === routine.id,
          );
    routine.activities = activitiesToAdd;
  
    };

    return routines;
  
  } catch (error){
    throw error;
  }
};



  async function getPublicRoutinesByActivity({ id }) {
    try {

      const { rows: routines } = await client.query(`
        SELECT routines.*,
              users.username as "creatorName"
        FROM routines
        JOIN users
          ON routines."creatorId" = users.id
        WHERE routines."isPublic" = true;
         `);
 
        const { rows:  activities } = await client.query(`
        SELECT *
        FROM activities
        JOIN routine_activities
           ON routine_activities."activityId"= activities.id
        WHERE activities.id = $1;
        `,[id]);

    for (const routine of routines) {
        const activitiesToAdd = activities.filter(
            (activity) => activity.routineId === routine.id,
        );
        routine.activities = activitiesToAdd;
    };

       return routines;
    } catch (error) {
      throw error;
    }
  };

    
async function createRoutine({ creatorId, isPublic, name, goal }) {
    try {
        const {rows:  [newRoutine] } = await client.query(
            `INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
            `, [creatorId, isPublic, name, goal]);
        
        return newRoutine;
    } catch (error){
        throw error ;
    }
};

      //  function setString(() => {
      //   const insert = Object.keys(updateObj).map(
      //              (key, index) => `"${key}" = $${index +1}`).join(', ')
      //  });

      
      
async function updateRoutine({ id, isPublic, name, goal }){
    try{

      const updateObj = {}
      const checkFields = { isPublic, name, goal };
      for ( const column in checkFields){
        if (checkFields[column] !== undefined){
          updateObj[column] = checkFields[column]
        }
      }
      const insert = Object.keys(updateObj).map(
        (key, index) => `"${key}" = $${index +1}`).join(', ');
      
      
      const { rows: [updatedRoutine] } = await client.query(
          `UPDATE routines
            SET ${ insert } 
            WHERE id = ${id}
            RETURNING *;
          `, Object.values(updateObj));

      return updatedRoutine;

    }catch (error){
        throw error;
    }
};


async function destroyRoutine(id){
    try{

          await client.query(`
              DELETE FROM routine_activities
              WHERE "routineId" = $1;
              `, [ id ]);

          const { rows : [routine]} = await client.query(`
            DELETE FROM routines
            WHERE id=$1
            RETURNING *;
              `, [ id ]);

      return routine;
    } catch (error){
      throw error;
    }
};

    module.exports = {
      getRoutineById,
      getRoutinesWithoutActivities,
      getAllRoutines,
      getAllPublicRoutines,
      getAllRoutinesByUser,
      getPublicRoutinesByUser,
      getPublicRoutinesByActivity,
      createRoutine,
      updateRoutine,
      destroyRoutine
    }