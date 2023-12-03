const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const FILE_WITH_URL = '_url_to_parse.txt'; //required!!!
const URL = fs.readFileSync(FILE_WITH_URL, 'utf8');
const FILE_NAME = URL.slice(URL.lastIndexOf('/') + 1);
const FILE_EXTENSION = 'css';
const DIRECTORY = 'output';

axios.get(URL).then((html) => {
	const $ = cheerio.load(html.data);

	let result = '';

	$('#class-table > table > tbody')
		.eq(0)
		.children('tr')
		.each((i, tr) => {
			let _className = '';
			let _css = '';

			$(tr)
				.children('td')
				.each((j, td) => {
					if (j === 0) _className = $(td).text();
					if (j === 1) {
						_css = '\t' + $(td).text().replace('\n', '\n\t');

						_css = $(td)
							.text()
							.split('\n')
							.filter((el) => el?.length > 0)
							.map((el) => '\n\t' + el)
							.join('');
					}
				});

			if (!_className.includes('.')) {
				result += `${i > 0 ? '\n\n' : ''}.${_className} {${_css}\n}`;
			}
		});

	writeFile(result);
});

const writeFile = (async = (_text) => {
	if (!fs.existsSync(DIRECTORY)) fs.mkdirSync(DIRECTORY);

	fs.writeFile(
		`${DIRECTORY}/${FILE_NAME}.${FILE_EXTENSION}`,
		_text,
		function (error) {
			if (error) {
				return console.log(error);
			}
			console.log(
				'\x1b[32m%s\x1b[0m',
				`The file \'${FILE_NAME}.${FILE_EXTENSION}\' was successfully written`
			);
			clearUrlFile();
		}
	);
});

const clearUrlFile = async () => {
	fs.writeFile(FILE_WITH_URL, '', function (error) {
		if (error) {
			return console.log(error);
		}
	});
};
