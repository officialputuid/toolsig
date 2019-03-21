'use strict'
//Last modified by I Putu Jaya Adi Pranata (officialputuid) on March 21, 2019
const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
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

    /** Save Account **/
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

const Like = async function(session,media){
    try {
        if (media.params.hasLiked) {
         return chalk`{bold.blue Already Liked}`;
     }
     await Client.Like.create(session, media.id);
     return chalk`{bold.green Success Liked}`;
 } catch (err) {
    return chalk`{bold.red Failed Liked}`;
}
}

const Excute = async function(User, sleep){
    try {
        console.log(chalk`{yellow \n[?] Try to Login . . .}`);
        const doLogin = await Login(User);
        console.log(chalk`{green [✓] Login Succsess}.\n{yellow [?] Try Like All Media in Feed / Timeline . . .\n}`);
        const feed = new Client.Feed.Timeline(doLogin.session);
        var cursor;
        do {
            var timeNow = new Date();
            timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
            if (cursor) feed.setCursor(cursor);
            var media = await feed.get();
            media = _.chunk(media, 10);
            for (var i = 0; i < media.length; i++) {
                await Promise.all(media[i].map(async (media) => {
                    const doLike = await Like(doLogin.session, media);
                    console.log(chalk`[{magenta ${timeNow}}]: Username: [${media.params.user.username}]\n[{cyan ${media.id}}] => [${doLike}]`);
                }))
                await console.log(chalk`{yellow \n[#][>] Delay For ${sleep} MiliSeconds [<][#]\n}`);
                await delay(sleep);
            }
        } while(feed.isMoreAvailable());
    } catch (err) {
        console.log(err);
    }
}

console.log(chalk`{bold.cyan
  Ξ TITLE  : BOTLIKE TIMELINE v1 [Set Sleep]
  Ξ CODE   : CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  Ξ STATUS : {bold.red [-ITTWY]} & {bold.yellow [TESTED]}}
  `);

inquirer.prompt(User)
.then(answers => {
    Excute({
        username:answers.username,
        password:answers.password
    },answers.sleep);
})
