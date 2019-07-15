import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

export default {
	input: './src/main',
	output: [{
			file: pkg.main,
			format: 'cjs',
		},
		{
			file: pkg.module,
			format: 'es',
		},
	],
	external: ['lil-lexer'],
	plugins: [
		commonjs(),
		babel({
			exclude: 'node_modules/**',
		}),
	],
}
