'use strict'
//Changed by Localheartzst1337
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
  "[!] Lihat Informasi Tools",
  "[-] BomLikeTarget [With Sleep]",
  "[-] Botlike TL v1 [With Sleep]",
  "[-] Botlike TL v2 [Automatic]",
  "[-] Delete All Media/POST IG",
  "[-] Unfollow All Following",
  "[-] Unfollow Not Followback",
  "[-] Follow Followers Target",
  "[-] Follow Account By Media",
  "[-] Follow Account By Hastag",
  "[-] Follow Account By Location",
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

      case "[!] Lihat Informasi Tools":
      const infotools = require('./tools/infotools.js');
      break;

      case "[-] BomLikeTarget [With Sleep]":
      const bomliketarget = require('./tools/bomliketarget.js');
      await bomliketarget();
      break;

      case "[-] Botlike TL v1 [With Sleep]":
      const botlike = require('./tools/botlike.js');
      await botlike();
      break;

      case "[-] Botlike TL v2 [Automatic]":
      const botlike2 = require('./tools/botlike2.js');
      await botlike2();
      break;

      case "[-] Delete All Media/POST IG":
      const dellallphoto = require('./tools/dellallphoto.js');
      await dellallphoto();
      break;

      case "[-] Unfollow All Following":
      const unfollall = require('./tools/unfollall.js');
      await unfollall();
      break;

      case "[-] Unfollow Not Followback":
      const unfollnotfollback = require('./tools/unfollnotfollback.js');
      await unfollnotfollback();
      break;

      case "[-] Follow Followers Target":
      const fftauto = require('./tools/fftauto.js');
      await fftauto();
      break;

      case "[-] Follow Account By Media":
      const flmauto = require('./tools/flmauto.js');
      await flmauto();
      break;

      case "[-] Follow Account By Hastag":
      const fah = require('./tools/fah.js');
      await fah();
      break;

      case "[-] Follow Account By Location":
      const flaauto = require('./tools/flaauto.js');
      await flaauto();
      break;

      default:
      console.log('\nERROR:\n[?] Aw, Snap! \n[!] Something went wrong while displaying this tool!\n[!] Please try again!');
    }
  } catch(e) {
    }
  }
  //this info was made by Localheartzst1337

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