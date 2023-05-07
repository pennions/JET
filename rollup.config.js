import commonjs from '@rollup/plugin-commonjs';

export default [{
    input: 'src/jet.js',
    output: {
        name: 'jet',
        file: 'dist/jet.js',
        format: 'umd'
    },
    plugins: [commonjs()]
}, {
    input: 'src/jet.js',
    output: {
        name: 'jet',
        file: 'docs/js/jet.js',
        format: 'umd'
    },
    plugins: [commonjs()]
},
{
    input: 'src/jet.js',
    output: {
        name: 'jet',
        file: 'dist/jet.es.js',
        format: 'es'
    },
    plugins: [commonjs()]
}];