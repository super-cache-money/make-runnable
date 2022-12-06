module.exports = {
	test_func: async function () {
		throw "Something went wrong"
	}
};

require('../../index');
