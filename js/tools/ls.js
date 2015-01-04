GW.define('Tool.LS', 'tool', {
	order: 500,
	name: 'ls',
	description: 'Lists files stored on Mega.co.nz.',
	allowArgs: true,
	usages: [
		'[-h] [-l] [-R] [<remotepaths>...]'
	],

	detail: [
	],

	examples: [{
		title: 'List all files:',
		commands: [
			'$ megals',
			'/',
			'/Contacts/',
			'/Inbox/',
			'/Root/',
			'/Root/README',
			'/Root/bigfile',
			'/Rubbish/'
		]
	}, {
		title: 'List all files in the /Root, recursively and with details',
		commands: [
			'$ megals -l /Root',
			'',
			'3RsS2QwJ                2             - 2013-01-22 12:31:06 /Root',
			'2FFSiaKZ    Xz2tWWB5Dmo 0          2686 2013-04-15 08:33:47 /Root/README',
			'udtDgR7I    Xz2tWWB5Dmo 0    4405067776 2013-04-10 19:16:02 /Root/bigfile'
		]
	}, {
		title: 'List all files in the /Root, recursively and with details, show only file names:',
		commands: [
			'$ megals -ln /Root',
			'',
			'2FFSiaKZ    Xz2tWWB5Dmo 0          2686 2013-04-15 08:33:47 README',
			'udtDgR7I    Xz2tWWB5Dmo 0    4405067776 2013-04-10 19:16:02 bigfile'
		]
	}],

	getOptsSpecCustom: function() {
		return [{ 
			longName: "recursive",
			shortName: 'R', 
			help: "List directories recursively. This is the default if no paths are specified."
		}, { 
			longName: "long",   
			shortName: 'l',   
			help: "List additional information about listed filesystem nodes. Node handle, owner, node type, file size, and the last modification date."
		}, {
			longName: "human",
			shortName: 'h',
			help: "Display file sizes in a human readable format."
		}, {
			argHelp: '<remotepaths>',
			help: [
				'One or more remote filesystem paths to list. If path points to a directory, contents of the directory and the directory itself is listed. When `--names` is given, only the contents of the directory is listed.',
				'If path points to a file, the file itself is listed.',
				'If ommited, the entire remote filesystem is listed recursively.'
			]

		}].concat(this.loginOpts);
	},

	run: function(defer) {
		var data = {};

		Defer.chain([
			function() {
				return this.getSession();
			},

			function(session) {
				data.session = session;

				return session.getFilesystem().load();
			},

			function() {
				var fs = data.session.getFilesystem();

				Log.msg(fs.getPaths().join('\n'));

				return Defer.resolved();
			}
		], this).then(function() {
			defer.resolve();
		}, function(code, msg) {
			Log.error(msg);
			defer.reject(1);
		}, this);
	}
});