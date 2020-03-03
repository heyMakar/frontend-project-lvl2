install:
	npm install

start:
	npx babel-node dist/bin/gendiff.js -h

publish:
	npm publish --dry-run

lint:
	npx eslint .

build:
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage