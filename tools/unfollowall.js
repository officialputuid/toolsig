const {
  chalk,
  inquirer,
  _,
  fs,
  instagram,
  print,
  delay,
} = require("./index.js");

(async () => {
  print(
    chalk`{bold.green
  ▄▄▄▄▄            ▄▄▌  .▄▄ · ▪   ▄▄ • 
  •██  ▪     ▪     ██•  ▐█ ▀. ██ ▐█ ▀ ▪
   ▐█.▪ ▄█▀▄  ▄█▀▄ ██▪  ▄▀▀▀█▄▐█·▄█ ▀█▄
   ▐█▌·▐█▌.▐▌▐█▌.▐▌▐█▌▐▌▐█▄▪▐█▐█▌▐█▄▪▐█
   ▀▀▀  ▀█▄▀▪ ▀█▄▀▪.▀▀▀  ▀▀▀▀ ▀▀▀·▀▀▀▀ 

  Ξ TITLE : Unfollow All Following User
  Ξ NOTE  : 116 111 111 108 115 105 103  118 51 
          : TESTED "OK" BUG? YouTellMe!
    }`
  );
  const questions = [
    {
      type: "input",
      name: "username",
      message: "Input username:",
      validate: (val) => val.length != 0 || "Please input username!",
    },
    {
      type: "password",
      name: "password",
      mask: "*",
      message: "Input password:",
      validate: (val) => val.length != 0 || "Please input password!",
    },
    {
      type: "input",
      name: "perExec",
      message: "Input limit per-execution:",
      validate: (val) => /[0-9]/.test(val) || "Only input numbers",
    },
    {
      type: "input",
      name: "delayTime",
      message: "Input delay time (in milliseconds):",
      validate: (val) => /[0-9]/.test(val) || "Only input numbers",
    },
  ];
  try {
    const {
      username,
      password,
      target,
      perExec,
      delayTime,
    } = await inquirer.prompt(questions);
    const ig = new instagram(username, password);
    print("Try to Login . . .", "wait", true);
    const login = await ig.login(),
      info = await ig.userInfo(login.pk);
    print(`Logged in as @${login.username} (ID: ${login.pk})`, "ok");
    print(`Collecting followed users . . .`, "wait");
    print(`You're following ${info.following_count} users!`, "ok");
    const following = await ig.followingFeed();
    print(
      `Doing task with ratio ${perExec} target / ${delayTime} milliseconds \n`,
      "wait"
    );
    do {
      let items = await following.items();
      items = _.chunk(items, perExec);
      for (let i = 0; i < items.length; i++) {
        await Promise.all(
          items[i].map(async (user) => {
            const unfollow = await ig.unfollow(user.pk);
            print(
              `▲ @${user.username} ⇶ ${
                unfollow
                  ? chalk.bold.green("Unfollowed!")
                  : chalk.bold.red("Failed to Unfollow!")
              }`
            );
          })
        );
        if (i < items.length - 1)
          print(
            `Current Account: (${login.username}) » Delay: ${perExec}/${delayTime}ms \n`,
            "wait",
            true
          );
        await delay(delayTime);
      }
    } while (following.moreAvailable);
    print(`Status: All Task done!`, "ok", true);
  } catch (err) {
    print(err, "err");
  }
})();
//by 1dcea8095a18ac73b764c19e40644b52 116 111 111 108 115 105 103  118 51 