const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    admin: { type: Schema.Types.ObjectId, ref: 'Administrator' }
});


module.exports = mongoose.model('Categoria', categoriaSchema);