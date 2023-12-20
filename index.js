import fs from 'fs'

fs.readFile('./assets/raw/test.md', 'utf8', (err, data) => {
	if (err) {
		console.log('Error acquired:')
		return err;
	}

	console.log(data)
	return;
})
