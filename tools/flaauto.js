'use strict'
//Last modified by I Putu Jaya Adi Pranata (officialputuid) on March 21, 2019
const Client = require('instagram-private-api').V1;
const chalk = require('chalk');
const delay = require('delay');
const _ = require('lodash');
const inquirer = require('inquirer');

const question = [
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
  name:'locationId',
  message:'Insert Location ID:',
  validate: function(value){
    value = value.match(/[0-9]/);
    if (value) return true;
    return 'Delay is number';
  }
},
{
  type:'input',
  name:'text',
  message:'Insert Text Comment (Use [|] if more than 1):',
  validate: function(value){
    if(!value) return 'Can\'t Empty';
    return true;
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


const doLogin = async (params) => {
  const Device = new Client.Device(params.username);
  const Storage = new Client.CookieMemoryStorage();
  const session = new Client.Session(Device, Storage);
  try {
    await Client.Session.create(Device, Storage, params.username, params.password)
    const account = await session.getAccount();
    return Promise.resolve({session,account});
  } catch (err) {
    return Promise.reject(err);
  }
}

const grabFollowers = async (session, id) => {
  const feed = new Client.Feed.AccountFollowers(session, id);
  try{
    feed.map = item => item.params;
    return Promise.resolve(feed.all());
  }catch (e){
    return Promise.reject(err);
  }
}

const doFollow = async (session, id) => {
  try {
    await Client.Relationship.create(session, id);
    return true;
  } catch (e) {
    return false;
  }
}

const doComment = async (session, id, text) => {
  try {
    await Client.Comment.create(session, id, text);
    return true;
  } catch(e){
    return false;
  }
}

const doLike = async (session, id) => {
  try{
    await Client.Like.create(session, id);
    return true;
  } catch(e) {
    return false;
  }
}

const doAction = async (session, params, text) => {
  const task = [
  doFollow(session, params.account.id),
  doLike(session, params.id),
  doComment(session, params.id, text)
  ];
  var [Follow,Like,Comment] = await Promise.all(task);
  Follow = Follow ? chalk`{bold.green SUKSES}` : chalk`{bold.red GAGAL}`;
  Comment = Comment ? chalk`{bold.green SUKSES}` : chalk`{bold.red GAGAL}`;
  Like = Like ? chalk`{bold.green SUKSES}` : chalk`{bold.red GAGAL}`;
  return chalk`[Follow: ${Follow}] [Like: ${Like}] [Comment: ${Comment} ({cyan ${text}})]`;
}

const doMain = async (account, locationid, sleep, text) => {
  console.log(chalk`\n{green [?] Try to Login ....}`);
  account = await doLogin(account);
  console.log(chalk`{bold.green [✓] Login Success!}`)
  const feed = new Client.Feed.LocationMedia(account.session, locationid);
  console.log(chalk`{green [?] Try Follow, Like and Comment All Account In LocationId: ${locationid}\n}`);
  try {
    var cursor;
    var count = 0;
    do {
      if (cursor) feed.setCursor(cursor);
      count++;  
      const media = await feed.get();
      console.log(chalk`\n[Cursor: {bold.cyan ${cursor ? cursor : 'null'}} | Count: {bold.cyan ${count}} | Total Media: {bold.cyan ${media.length}} | Delay: ${sleep} MiliSeconds ]\n`);
      var timeNow = new Date();
      timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
      await Promise.all(media.map(async(media)=>{
        const ranText = text[Math.floor(Math.random() * text.length)];
        const resultAction = await doAction(account.session, media.params, ranText);
        console.log(chalk`[{magenta ${timeNow}}] ${media.id} | {cyanBright @${media.params.account.username}}\n=> ${resultAction}`);
      }))
      await delay(sleep);
      cursor = await feed.getCursor();
    } while(feed.isMoreAvailable());
  } catch(e) {
    console.log(e);
  }
}
console.log(chalk`{bold.cyan
  Ξ TITLE  : FLA [FOLLOW-LIKE-COMMENT TARGET LOCATION-ID]
  Ξ CODE   : CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  Ξ STATUS : {bold.red [-ITTWY]} & {bold.yellow [TESTED]}}
      `);
inquirer.prompt(question)
.then(answers => {
  var text = answers.text.split('|');
  doMain({
    username:answers.username, 
    password:answers.password}, answers.locationId, answers.sleep, text);
})
.catch(e => {
  console.log(e);
})
