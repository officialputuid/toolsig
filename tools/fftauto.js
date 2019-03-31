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
  name:'text',
  message:'Insert Text Comment (Use [|] if more than 1):',
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

async function ngefollow(session,accountId){
  try {
    await Client.Relationship.create(session, accountId);
    return true
  } catch (e) {
    return false
  }
}

async function ngeComment(session, id, text){
  try {
    await Client.Comment.create(session, id, text);
    return true;
  } catch(e){
    return false;
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

const CommentAndLike = async function(session, accountId, text){
  var result;

  const feed = new Client.Feed.UserMedia(session, accountId);

  try {
    result = await feed.get();
  } catch (err) {
    return chalk`{bold.red ${err}}`;
  }

  if (result.length > 0) {
    const task = [
    ngefollow(session, accountId),
    ngeComment(session, result[0].params.id, text),
    ngeLike(session, result[0].params.id)
    ]
    const [Follow,Comment,Like] = await Promise.all(task);
    const printFollow = Follow ? chalk`{green Follow}` : chalk`{red Follow}`;
    const printComment = Comment ? chalk`{green Comment}` : chalk`{red Comment}`;
    const printLike = Like ? chalk`{green Like}` : chalk`{red Like}`;
    return chalk`{bold.green ${printFollow}:${printComment}:${printLike} » {bold.cyan ${text}}}`;
  }
  return chalk`{cyan {bold.red (SKIPPED)} TIMELINE EMPTY!}`
};

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

const Excute = async function(User, TargetUsername, Text, Sleep, ittyw){
  try {
    console.log(chalk`{yellow \n? Try to Login . . .}`)
    const doLogin = await Login(User);
    console.log(chalk`{green ✓ Login Succsess. }{yellow ? Try To Get ID & Followers Target . . .}`)
    const getTarget = await Target(TargetUsername);
    console.log(chalk`{green ✓ UserID ${TargetUsername}»${getTarget.id} ϟ Total Followers: [${getTarget.followers}]}`)
    const getFollowers = await Followers(doLogin.session, doLogin.account.id)
    console.log(chalk`{cyan ? Try to Follow, Comment, and Like Followers Target . . . \n}`)
    const Targetfeed = new Client.Feed.AccountFollowers(doLogin.session, getTarget.id);
    var TargetCursor;
    console.log(chalk`{yellow ≡ READY TO START FFTAUTO WITH RATIO ${ittyw} TARGET/${Sleep} MiliSeconds\n}`)
    do {
      if (TargetCursor) Targetfeed.setCursor(TargetCursor);
      var TargetResult = await Targetfeed.get();
      TargetResult = _.chunk(TargetResult, ittyw);
      for (let i = 0; i < TargetResult.length; i++) {
        var timeNow = new Date();
        timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
        await Promise.all(TargetResult[i].map(async(akun) => {
          if (!getFollowers.includes(akun.id) && akun.params.isPrivate === false) {
            var ranText = Text[Math.floor(Math.random() * Text.length)];
            const ngeDo = await CommentAndLike(doLogin.session, akun.id, ranText)
            console.log(chalk`{magenta ⌭ ${timeNow}}: ${akun.params.username} ➾ ${ngeDo}`)
          } else {
            console.log(chalk`{magenta ⌭ ${timeNow}}: ${akun.params.username} ➾ {bold.red SKIPPED} ➾ PRIVATE/FOLLOWED!`)
          }
        }));
        console.log(chalk`{yellow \nϟ Current Account: {bold.green ${User.username}} » Delay: ${ittyw}/${Sleep}ms\n}`);
        await delay(Sleep);
      }
      TargetCursor = await Targetfeed.getCursor();
      console.log(chalk`{yellow \nϟ Current Account: {bold.green ${User.username}} » Delay: ${ittyw}/${Sleep}ms\n}`);
      await delay(Sleep);
    } while(Targetfeed.isMoreAvailable());
  } catch (err) {
    console.log(err);
  }
}
console.log(chalk`{bold.cyan
  Ξ TITLE  : FFT [FOLLOW-LIKE-COMMENT TARGET FOLLOWER]
  Ξ CODE   : CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  Ξ STATUS : {bold.green [+ITTWY]} & {bold.yellow [TESTED]}}
      `);
inquirer.prompt(User)
.then(answers => {
  var text = answers.text.split('|');
  Excute({
    username:answers.username,
    password:answers.password
  },answers.target,text,answers.sleep,answers.ittyw);
})
