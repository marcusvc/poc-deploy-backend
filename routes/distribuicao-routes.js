'use strict';

module.exports = function (app) {

	var controller = require('../controllers/distribuicao-controller');

	// Routes
	app.route('/hello')
		.get(controller.hello);

	app.route('/distribuicao')
		.get(controller.list_all_distribuicao)
		.post(controller.create_a_distribuicao);

	app.route('/distribuicao/:msgId')
		.get(controller.read_a_distribuicao)
		.put(controller.update_a_distribuicao)
		.delete(controller.delete_a_distribuicao);

};