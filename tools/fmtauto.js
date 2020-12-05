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

  Ξ TITLE : Folow Like Comment (Media Target)
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
      name: "url",
      message: "Input media URL:",
      validate: (val) => val.length != 0 || "Please input media URL!",
    },
    {
      type: "input",
      name: "inputMessage",
      message: "Input text's message (more? '|') :",
      validate: (val) => val.length != 0 || "Please input text's Message!",
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
      url,
      perExec,
      delayTime,
      inputMessage
    } = await inquirer.prompt(questions);
    const ig = new instagram(username, password);
    print("Try to Login . . .", "wait", true);
    const login = await ig.login();
    print(`Logged in as @${login.username} (User ID: ${login.pk})`, "ok");
    print(`Collecting users in media likers . . .`, "wait");
    const id = await ig.getMediaIdByUrl(url);
    let likers = await ig.getMediaLikers(id);
    likers = _.chunk(likers.users, perExec);
    print(
      `Doing task with ratio ${perExec} target / ${delayTime} milliseconds \n`,
      "wait"
    );
    for (let i = 0; i < likers.length; i++) {
      await Promise.all(
        likers[i].map(async (liker) => {
          const status = await ig.friendshipStatus(liker.pk);
          if (!liker.is_private && !status.following && !status.followed_by) {
            const media = await ig.userFeed(liker.pk),
              lastMedia = await media.items();
            const text = inputMessage.split("|");
            const msg = text[Math.floor(Math.random() * text.length)];
            if (lastMedia.length != 0 && lastMedia[0].pk) {
              const task = [
                ig.follow(liker.pk),
                ig.like(lastMedia[0].pk),
                ig.comment(lastMedia[0].pk, msg),
              ];
              let [follow, like, comment] = await Promise.all(task);
              follow = follow
                ? chalk.bold.green(`Follow`)
                : chalk.bold.red("Follow");
              like = like ? chalk.bold.green("Like") : chalk.bold.red("Like");
              comment = comment
                ? chalk.bold.green("Comment")
                : chalk.bold.red("Comment");
              print(
                `▲ @${
                  liker.username
                } ⇶ [${follow}, ${like}, ${comment}] ⇶ ${chalk.cyanBright(
                  msg
                )}`
              );
            } else
              print(
                chalk`▼ @${liker.username} ⇶ {yellow No posts yet, Skip.}`
              );
          } else
            print(
              chalk`▼ @${liker.username} ⇶ {yellow Private or already followed/follows you, Skip.}`
            );
        })
      );
      if (i < likers.length - 1)
        print(
          `Current Account: (${login.username}) » Delay: ${perExec}/${delayTime}ms \n`,
          "wait",
          true
        );
      await delay(delayTime);
    }
    print(`Status: All Task done!`, "ok", true);
  } catch (err) {
    print(err, "err");
  }
})();
//by 1dcea8095a18ac73b764c19e40644b52 116 111 111 108 115 105 103  118 51 