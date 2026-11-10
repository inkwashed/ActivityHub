/* Compatibility entrypoint: one authoritative generation path for all previews. */
console.warn('build-pizza-preview.cjs is retired; use generate-home-previews.cjs. Forwarding to the complete preview workflow.');
require('./generate-home-previews.cjs').run(process.argv.includes('--check'));
