//================
//PUERTO
//================
process.env.PORT = process.env.PORT || 3000;

//================
//ENTORNO
//================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================
//SEED DE AUTENTICACION
//================
process.env.SEED =  process.env.SEED || 'este-es-el-seed-desarrollo';

//================
//VENCIMIENTO DEL TOKEN
//================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';

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
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//================
//GOOGLE CLIENT ID
//================
process.env.CLIENT_ID = process.env.CLIENT_ID || '341065292986-13fh6jv8iodlq1j9p4que7cndslfhcgd.apps.googleusercontent.com';

// mongodb://<dbuser>:<dbpassword>@ds363996.mlab.com:63996/db_tron
// mongodb://localhost:27017/db_tron

// heroku config:set MONGO_URI="XXXXXXX"
 
//     heroku config:get nombre
//     heroku config:unset nombre
//     heroku config:set nombre="Fernando"