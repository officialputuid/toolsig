'use strict'

// Recode by officialputuid
// Last modified by I Putu Jaya Adi Pranata (officialputuid) on March 30, 2019
// fb|ig|twitter|gplus|line|github|behance|medium? officialputuid & https://officialputu.id

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');

const User = [
{
	type:'input',
	name:'username',
	message:'[>] Insert Username:',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
},
{
	type:'password',
	name:'password',
	message:'[>] Insert Password:',
	mask:'*',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
},
{
	type:'input',
	name:'ittyw',
	message:'[>] Input Total of Target You Want (ITTYW):',
	validate: function(value){
		value = value.match(/[0-9]/);
		if (value) return true;
		return 'Use Number Only!';
	}
},
{
	type:'input',
	name:'sleep',
	message:'[>] Insert Sleep (MiliSeconds):',
	validate: function(value){
		value = value.match(/[0-9]/);
		if (value) return true;
		return 'Delay is number';
	}
}
]

const Login = async function(User){

	const Device = new Client.Device(User.username);
	const Storage = new Client.CookieMemoryStorage();
	const session = new Client.Session(Device, Storage);

	try {
		await Client.Session.create(Device, Storage, User.username, User.password)
		const account = await session.getAccount();
		return Promise.resolve({session,account});
	} catch (err) {
		return Promise.reject(err);
	}

}

const Media = async function(session, id){
	const Media = new Client.Feed.UserMedia(session, id);

	try {
		const Poto = [];
		var cursor;
		do {
			if (cursor) Media.setCursor(cursor);
			const getPoto = await Media.get();
			await Promise.all(getPoto.map(async(poto) => {
				Poto.push({
					id:poto.id,
					link:poto.params.webLink
				});
			}))
			cursor = await Media.getCursor()
		} while (Media.isMoreAvailable());
		return Promise.resolve(Poto);
	} catch (err){
		return Promise.reject(err);
	}
}

const Delete = async function(session, id){
	try {
		await Client.Media.delete(session,id);
		return true;
	} catch (err) {
		return false;
	}
}


const Excute = async function(User,sleep,ittyw){
	try {
		console.log(chalk`{yellow \n? Try to Login . . .}`)
		const doLogin = await Login(User);
		console.log(chalk`{green ✓ Login Succsess. }{yellow ? Try To Get All Media . . .}`);
		var getMedia = await Media(doLogin.session, doLogin.account.id);
		console.log(chalk`{green ✓ Succsess To Get All Media. Media Length : ${getMedia.length}}\n`);
		console.log(chalk`{yellow ≡ READY TO START MASS DELETE WITH RATIO ${ittyw} MEDIA/${sleep} MiliSeconds\n}`)
		getMedia = _.chunk(getMedia, ittyw);
		var timeNow = new Date();
        timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
		for (let i = 0; i < getMedia.length; i++) {
			await Promise.all(getMedia[i].map(async(media) => {
				const doDelete = await Delete(doLogin.session, media.id);
				const PrintOut = chalk`{magenta ⌭ ${timeNow}}: ${media.link} ➾ ${doDelete ? chalk`{bold.green Sukses}` : chalk`{bold.red Gagal}`}`
				console.log(PrintOut);
			}))
			console.log(chalk`{yellow \nϟ Current Account: {bold.green ${User.username}} » Delay: ${ittyw}/${sleep}ms\n}`);
			await delay(sleep)
		}

	} catch (err) {
		console.log(err);
	}
}
console.log(chalk`{bold.cyan
  Ξ TITLE  : MASS DELETE POST IG [Set Sleep]
  Ξ CODE   : CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  Ξ STATUS : {bold.green [+ITTWY]} & {bold.yellow [TESTED]}}
      `);
inquirer.prompt(User)
.then(answers => {
	Excute({
		username:answers.username,
		password:answers.password
	},answers.sleep,answers.ittyw);
})
