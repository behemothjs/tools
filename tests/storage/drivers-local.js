const test = require('ava');
const {Storage} = require('../../build/cjs');
const storage = new Storage({
	default: 'local',
	disks: {
		local: {
			driver: 'local',
			root: 'tests/storage/files',
		},
	},
});

test.serial('put', async t => {
	await Promise.all([
		storage.disk('local').put('file1.txt', '111'),
		storage.disk('local').put('file2.txt', '222'),
		storage.disk('local').put('file3.txt', '333'),
	]);
	const files = await storage.disk('local').files();
	t.is(files.length, 3);
});

test.serial('stream', async t => {
	const rs = await storage.disk('local').createReadStream('file1.txt');
	const ws = await storage.disk('local').createWriteStream('file4.txt');
	await rs.pipe(ws);
	await new Promise(r => setTimeout(r, 1000));
	const files = await storage.disk('local').files();
	t.is(files.length, 4);
});

test.serial('get', async t => {
	const contents = await storage.disk('local').get('file1.txt');
	t.is(contents, '111');
});

test.serial('copy', async t => {
	await storage.disk('local').copy('file1.txt', 'file1_copy.txt');
	const contents = await storage.disk('local').get('file1_copy.txt');
	t.is(contents, '111');
});

test.serial('move', async t => {
	await storage.disk('local').move('file1_copy.txt', 'file5.txt');
	const contents = await storage.disk('local').get('file5.txt');
	t.is(contents, '111');
});

test.serial('delete', async t => {
	await Promise.all([
		storage.disk('local').delete('file1.txt'),
		storage.disk('local').delete('file2.txt'),
		storage.disk('local').delete('file3.txt'),
		storage.disk('local').delete('file4.txt'),
		storage.disk('local').delete('file5.txt'),
	]);
	const files = await storage.disk('local').files();
	t.is(files.length, 0);
});
