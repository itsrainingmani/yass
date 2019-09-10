module.exports = {
	parser: '@typescript-eslint/parser', // specifies the eslint parser
	plugins: ['@typescript-eslint'],
	extends: [
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module" // allows for the use of imports
	},
	rules: {
		"no-cond-assign": 0,
		"no-unused-vars": 2,
		"object-shorthand": [
			2,
			"always"
		],
		"no-console": 0,
		"no-const-assign": 2,
		"no-class-assign": 2,
		"no-this-before-super": 2,
		"no-var": 2,
		"no-unreachable": 2,
		"valid-typeof": 2,
		"one-var": [
			2,
			"never"
		],
		"prefer-arrow-callback": 2,
		"prefer-const": [
			2,
			{
				"destructuring": "all"
			}
		],
		"no-inner-declarations": 0
	}
}
