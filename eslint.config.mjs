import ljharbConfig from '@ljharb/eslint-config/flat/node/16';

export default [
	...ljharbConfig,
	{
		rules: {
			'func-name-matching': 'warn',
			'func-style': 'off',
			'no-magic-numbers': 'off',
		},
	},
	{
		files: ['test/**/*'],
		rules: {
			'id-length': 'off',
		},
	},
];
