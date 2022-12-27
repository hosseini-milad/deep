const AdminBro = require('admin-bro');
const uploadFeature = require('@admin-bro/upload')
const mongooseAdmin = require('@admin-bro/mongoose');

const Report = require('../model/reports/standardReport');


const contentParent = {
    name:'content',
    icon:'eye'
}
const userParent = {
    name:'User',
    icon:'eye'
}
const brandParent = {
  name:'Brand',
  icon:'book'
}
const parameterParent = {
  name:'Parameters',
  icon:'book'
}
const orderParent = {
  name:'Order',
  icon:'book'
}
const AdminBroOptions = {
    resources:[
    {resource: Report, options: { parent: userParent } },
    ]
}
const adminBro = new AdminBro(AdminBroOptions);


module.exports = adminBro;