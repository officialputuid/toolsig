'use strict'

// Recode by officialputuid
// Last modified by I Putu Jaya Adi Pranata (officialputuid) on March 30, 2019
// fb|ig|twitter|gplus|line|github|behance|medium? officialputuid & https://officialputu.id

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const rp = require('request-promise');
const inquirer = require('inquirer');

const User = [
{
	type:'input',
	name:'username',
	message:'Insert Username:',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
},
{
	type:'password',
	name:'password',
	message:'Insert Password:',
	mask:'*',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
},
{
	type:'input',
	name:'ittyw',
	message:'Input Total of Target You Want (ITTYW):',
	validate: function(value){
		value = value.match(/[0-9]/);
		if (value) return true;
		return 'Use Number Only!';
	}
},
{
	type:'input',
	name:'sleep',
	message:'Insert Sleep (In MiliSeconds):',
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

const Followers = async function(session, id){
	const feed = new Client.Feed.AccountFollowers(session, id);
	try{
		const Pollowers = [];
		var cursor;
		do {
			if (cursor) feed.setCursor(cursor);
			const getPollowers = await feed.get();
			await Promise.all(getPollowers.map(async(akun) => {
				Pollowers.push(akun.id);
			}))
			cursor = await feed.getCursor();
		} while(feed.isMoreAvailable());
		return Promise.resolve(Pollowers);
	} catch(err){
		return Promise.reject(err);
	}
}

const Following = async function(session, id){
	const feed = new Client.Feed.AccountFollowing(session, id);
	try{
		const Pollowing = [];
		var cursor;
		do {
			if (cursor) feed.setCursor(cursor);
			const getPollowers = await feed.get();
			await Promise.all(getPollowers.map(async(akun) => {
				Pollowing.push(akun.id);
			}))
			cursor = await feed.getCursor();
		} while(feed.isMoreAvailable());
		return Promise.resolve(Pollowing);
	} catch(err){
		return Promise.reject(err);
	}
}

const Unfollow = async function(session, accountId){
	try {
		await Client.Relationship.destroy(session, accountId);
		return chalk`{bold.green Success}`;
	} catch (err){
		return chalk`{bold.red Failed}`;
	}
}

const Excute = async function(User,sleep,ittyw){
	try {
		console.log(chalk`\n{yellow ? Try to Login . . .}`);
		const doLogin = await Login(User);
		console.log(chalk`{green ✓ Login Succsess. }{yellow ? Try to get list followers, following and unfollow . . .}`);
		const task = [
		Followers(doLogin.session, doLogin.account.id),
		Following(doLogin.session, doLogin.account.id)
		]
		const [getFollowers, getFollowing] = await Promise.all(task);
		console.log(chalk`{green ! Successfully Get Data: {bold.cyan Followers: ${getFollowers.length}} » {bold.cyan Following: ${getFollowing.length}}}`);
		var AccountToUnfollow = [];
		await Promise.all(getFollowing.map(async(account) => {
			if (!getFollowers.includes(account)) {
				await AccountToUnfollow.push(account);
			}
		}));
		console.log(chalk`{green ! Success in Finding Value {bold.red Unfollow: ${AccountToUnfollow.length}}\n}`);
		console.log(chalk`{yellow ≡ READY TO START UFNFB WITH RATIO ${ittyw} TARGET/${sleep} MiliSeconds\n}`);
		AccountToUnfollow = _.chunk(AccountToUnfollow, ittyw);
		for (let i = 0; i < AccountToUnfollow.length; i++) {
			var timeNow = new Date();
			timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
			await Promise.all(AccountToUnfollow[i].map(async(akun) => {
				const doUnfollow = await Unfollow(doLogin.session, akun);
				console.log(chalk`{magenta ⌭ ${timeNow}}: @${akun} ➾ Unfollow ${doUnfollow}`);
			}))
			await console.log(chalk`{yellow \nϟ Current Account: {bold.green ${User.username}} » Delay: ${ittyw}/${sleep}ms\n}`);
			await delay(sleep);
		}
	} catch(err) {
		console.log(err);
	}
}
console.log(chalk`{bold.cyan
  Ξ TITLE  : UNFB [UNFOLLOW NOT FOLLOWBACK INSTAGRAM]
  Ξ CODE   : CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  Ξ STATUS : {bold.green [+ITTWY]} & {bold.yellow [TESTED]}}
      `);
inquirer.prompt(User)
.then(answers => {
	Excute({
		username:answers.username,
		password:answers.password
	},answers.sleep,answers.ittyw);
});
