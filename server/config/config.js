//================
//PUERTO
//================
process.env.PORT = process.env.PORT || 3000;

//================
//ENTORNO
//================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================
//BASE DE DATOS
//================
let urlDB;

if(process.env.NODE_ENV ==='dev')
{
    urlDB = 'mongodb://localhost:27017/db_tron';
}
else
{
    urlDB = 'mongodb://gym-user:GymUser.2018@ds363996.mlab.com:63996/db_tron';
}

process.env.URLDB = urlDB;

// mongodb://<dbuser>:<dbpassword>@ds363996.mlab.com:63996/db_tron
// mongodb://localhost:27017/db_tron