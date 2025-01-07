/*Communicate with the database in order to query information. 
 */
const mysql = require('mysql2');


/*Create connection with the database */
const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: '#Cherrystop212',
    database: 'recipe_db'

});

connection.connect((err) => {
    if (err){
        console.error('connection error: ', err);
        return;
    }
    console.log("connected");
});

/**Query data, returning the data fetched from the db  */
async function queryData(sqlQuery, data){

        //const query = 'SELECT * FROM recipe';
        /**Execute query */
        connection.query(sqlQuery, data, (err,results) => {
             if(err) {
                console.error("Query failed:" , err);
                return;
            }
            console.log('results: ', results);
            return results;
           //How are results returned???
});
};

//add error checking
function closeConnection(){
    connection.end((err) => {
        if(err){
            console.error('Error closing connection: ', err);
            return;
        }
        console.log('Db connection closed');

    });
}

//

module.exports = {
    queryData,
    closeConnection,
};