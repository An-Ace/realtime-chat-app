const node_production = true;
const socketUrl = node_production ? 'https://socket.itemstore.id': 'http://localhost:4000'
const apiUrl = node_production ? 'https://api.itemstore.id': 'http://localhost:5000'
const feUrl = node_production ? 'https://test.itemstore.id': 'http://localhost:3000'
const rmUrl = node_production ? 'amqp://localhost': 'amqp://localhost'

module.exports = { socketUrl, apiUrl, feUrl, rmUrl }