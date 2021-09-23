
const { client } = require('./client');


async function getActivityById(activityId) {
    try {
        const { rows: [ activity ]  } = await client.query(`
            SELECT *
            FROM activities
            WHERE id=$1;
            `, [activityId]);
        return activity;
    } catch (error) {
      throw error;
    }
};


async function getAllActivities(){
    try{
                const { rows: activities } = await client.query(`
                  SELECT *
                  FROM activities;
                  `);
        return activities;

    } catch (error) {
        throw error;
    }
}


async function createActivity({name, description}) {
    try {
          //need to loop over this to insert into table
          const {rows: [newActivity]} = await client.query(
              `INSERT INTO activities(name, description)
              VALUES ($1, $2)
              RETURNING *;
              `, [name, description]);
      
          return newActivity;
      } catch (error){
        throw error;
      }
    };


async function updateActivity({ id, name, description }){
    try{
        
      const updateObj = {}
      const checkFields = { name, description };
      for ( const column in checkFields){
        if (checkFields[column] !== undefined){
          updateObj[column] = checkFields[column]
        }
      }
      const insert = Object.keys(updateObj).map(
        (key, index) => `"${key}" = $${index +1}`).join(', ');

      const { rows: [ updatedActivity ] } = await client.query(
          `UPDATE activities
            SET ${ insert }
            WHERE id = ${ id }
            RETURNING *;
          `, Object.values(updateObj));

      return updatedActivity;

    } catch (error){
        throw error;
    }
};


module.exports ={
    getActivityById,
    getAllActivities,
    createActivity,
    updateActivity
};