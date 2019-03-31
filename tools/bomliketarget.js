'use strict'

// Recode by officialputuid
// Last modified by I Putu Jaya Adi Pranata (officialputuid) on March 30, 2019
// fb|ig|twitter|gplus|line|github|behance|medium? officialputuid & https://officialputu.id

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const rp = require('request-promise');
const S = require('string');
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
  name:'target',
  message:'Insert Username Target (Without @[at]):',
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
  message:'Insert Sleep ( In MiliSeconds):',
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
const Target = async function(username){
  const url = 'https://www.instagram.com/'+username+'/'
  const option = {
    url: url,
    method: 'GET'
  }
  try{
    const account = await rp(option);
    const data = S(account).between('<script type="text/javascript">window._sharedData = ', ';</script>').s
    const json = JSON.parse(data);
    if (json.entry_data.ProfilePage[0].graphql.user.is_private) {
      return Promise.reject('Target is private Account');
    } else {
      const id = json.entry_data.ProfilePage[0].graphql.user.id;
      const followers = json.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
      return Promise.resolve({id,followers});
    }
  } catch (err){
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

async function ngeLike(session, id){
  try{
    await Client.Like.create(session, id)
    return true;
  } catch(e) {
    return false;
  }
}

const Excute = async function(User, TargetUsername, ittyw, sleep){
  try {
	console.log(chalk`{yellow \n? Try to Login . . .}`)
    const doLogin = await Login(User);
	console.log(chalk`{green ✓ Login Succsess. }{yellow ? Try To Get All Media Target . . .}`)
    const getTarget = await Target(TargetUsername);
    var getMedia = await Media(doLogin.session, getTarget.id);
    console.log(chalk`{bold.green ✓ Succsess To Get All Media/Posts Target » ${TargetUsername} }\n`);
    console.log(chalk`{yellow ≡ READY TO START BOM LIKE TARGET WITH RATIO ${ittyw} TARGET/${sleep} MiliSeconds\n}`)
    getMedia = _.chunk(getMedia, ittyw);
    for (let i = 0; i < getMedia.length; i++) {
	  var timeNow = new Date();
      timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
      await Promise.all(getMedia[i].map(async(media) => {
        const doDelete = await ngeLike(doLogin.session, media.id);
        const PrintOut = chalk`{magenta ⌭ ${timeNow}} ➾ ${media.link} ➾ ${doDelete ? chalk`{bold.green Success Liked}` : chalk`{bold.red Failed to Liked!}`}`
        console.log(PrintOut);
      }))
	  console.log(chalk`{yellow \nϟ Current Account: {bold.green ${User.username}} » Delay: ${ittyw}/${sleep}ms\n}`);
          await delay(sleep)
    }
    console.log(chalk`{yellow ✓ All Posts Have Been Liked and Succeeded » Status: All Done » Time: ${timeNow} \n}`);
	
  } catch (err) {
    console.log(err);
  }
}
console.log(chalk`{bold.cyan
  Ξ TITLE  : BOM LIKE POST TARGET [Set Sleep]
  Ξ CODE   : CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  Ξ STATUS : {bold.green [+ITTWY]} & {bold.yellow [TESTED]}}
      `);
inquirer.prompt(User)
.then(answers => {
  Excute({
    username:answers.username,
    password:answers.password
  },answers.target,answers.ittyw,answers.sleep);
});
