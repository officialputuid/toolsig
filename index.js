'use strict'
//Last modified by I Putu Jaya Adi Pranata (officialputuid) on March 21, 2019
const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const inquirer = require('inquirer');
var moment = require("moment");
var colors = require('colors');
var userHome = require('user-home');

//DETECT IP *START!
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
//DETECT IP *END!

const questionTools = [
{
  type:"list",
  name:"Tools",
  message:"Select tools:\n ",
  choices:
  [
  "► Bom Like Target              [USING ITTYW/DELAY]",
  "► Bot Like Timeline v1         [5 TARGET/DELAY]",
  "► Bot Like Timeline v2         [USING CURSOR *AUTOMATIC]",
  "► Mass Delete Post/Photo       [USING ITTYW/DELAY]",
  "► Unfollow All Following       [USING ITTYW/DELAY]",
  "► Unfollow Not Followback      [USING ITTYW/DELAY]",
  "► Follow Followers Target      [USING ITTYW/DELAY]",
  "► Follow Account By Media      [USING ITTYW/DELAY]",
  "► Follow Account By Hastag     [USING ITTYW/DELAY]",
  "► Follow Account By Location   [USING CURSOR *AUTOMATIC]".white.bold,
  "\n"
  ] 
}
]
const main = async () => {
  //var Localheartzst1337;
  try{
    var toolChoise = await inquirer.prompt(questionTools);
    toolChoise = toolChoise.Tools;
    switch(toolChoise){

      case "► Bom Like Target              [USING ITTYW/DELAY]".bold.bgRed:
      const bomliketarget = require('./tools/bomliketarget.js');
      await bomliketarget();
      break;

      case "► Bot Like Timeline v1         [5 TARGET/DELAY]":
      const botlike = require('./tools/botlike.js');
      await botlike();
      break;

      case "► Bot Like Timeline v2         [USING CURSOR *AUTOMATIC]":
      const botlike2 = require('./tools/botlike2.js');
      await botlike2();
      break;

      case "► Mass Delete Post/Photo       [USING ITTYW/DELAY]":
      const dellallphoto = require('./tools/dellallphoto.js');
      await dellallphoto();
      break;

      case "► Unfollow All Following       [USING ITTYW/DELAY]":
      const unfollall = require('./tools/unfollall.js');
      await unfollall();
      break;

      case "► Unfollow Not Followback      [USING ITTYW/DELAY]":
      const unfollnotfollback = require('./tools/unfollnotfollback.js');
      await unfollnotfollback();
      break;

      case "► Follow Followers Target      [USING ITTYW/DELAY]":
      const fftauto = require('./tools/fftauto.js');
      await fftauto();
      break;

      case "► Follow Account By Media      [USING ITTYW/DELAY]":
      const flmauto = require('./tools/flmauto.js');
      await flmauto();
      break;

      case "► Follow Account By Hastag     [USING ITTYW/DELAY]":
      const fah = require('./tools/fah.js');
      await fah();
      break;

      case "► Follow Account By Location   [USING CURSOR *AUTOMATIC]":
      const flaauto = require('./tools/flaauto.js');
      await flaauto();
      break;

      default:
      console.log("\n ERROR:".red.bold,"Aw, Snap! Something went wrong while displaying this tool!\n".green.bold,"NOT FOUND! Please try again!".yellow.bold);
    }
  } catch(e) {
    }
  }
  //Last modified by I Putu Jaya Adi Pranata (officialputuid) on March 21, 2019

  console.log(chalk`{bold.green
  Ξ TITLE  : INSTAGRAM PRIVATE TOOLS
  Ξ UPLOAD : 19/02/2019 [10.00 WITA]
  Ξ CODEBY : Aldi Nugraha [Ccocot Ccocot]
  Ξ UPDATE : officialputuid [Localheartzst1337]
  Ξ FILES  : https://github.com/officialputuid/toolsig
  }`);
  console.log(chalk`{bold.red   •••••••••••••••••••••••••••••••••••••••••}`);
  console.log("  Ξ START  : ".bold.red + moment().format('D MMMM YYYY, h:mm:ss a'));
  console.log("  Ξ YPATH  : ".bold.red +userHome);
  console.log("  Ξ YOUIP  : ".bold.red +addresses);
  console.log(chalk`{bold.red   •••••••••••••••••••••••••••••••••••••••••}`);
  console.log(chalk`{bold.yellow
  Ξ THANKS : Instagram Private Tools [Original Source File]
           : Zerobyte.ID | BC0DE.NET | NAONLAH.NET | WingkoColi
           : ccocot@bc0de.net and Thank's To SGB TEAM REBORN}`);
  console.log('\n')
  main();
