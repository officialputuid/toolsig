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

  Ξ TITLE : Folow Like Comment (Hastag Target)
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
      name: "hashtag",
      message: "Input hashtag (without '#'):",
      validate: (val) => val.length != 0 || "Please input hashtag!",
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
      message: "Input sleep time (in milliseconds):",
      validate: (val) => /[0-9]/.test(val) || "Only input numbers",
    },
  ];

  try {
    const {
      username,
      password,
      hashtag,
      perExec,
      delayTime,
      inputMessage
    } = await inquirer.prompt(questions);
    const ig = new instagram(username, password);
    print("Try to Login . . .", "wait", true);
    const login = await ig.login();
    print(`Logged in as @${login.username} (User ID: ${login.pk})`, "ok");
    print("Collecting users in tagged media . . .", "wait");
    const tags = await ig.tagFeed(hashtag);
    print(
      `Doing task with ratio ${perExec} target / ${delayTime} milliseconds \n`,
      "wait"
    );
    do {
      let items = await tags.items();
      items = _.chunk(items, perExec);
      for (let i = 0; i < items.length; i++) {
        await Promise.all(
          items[i].map(async (media) => {
            const status = await ig.friendshipStatus(media.user.pk);
            if (
              !media.has_liked &&
              !media.user.is_private &&
              !status.following &&
              !status.followed_by
            ) {
              const text = inputMessage.split("|");
              const msg = text[Math.floor(Math.random() * text.length)];
              const task = [
                ig.follow(media.user.pk),
                ig.like(media.pk),
                ig.comment(media.pk, msg),
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
                  media.user.username
                } ⇶ [${follow}, ${like}, ${comment}] ⇶ ${chalk.cyanBright(
                  msg
                )}`
              );
            } else
              print(
                chalk`▼ @${media.user.username} ⇶ {yellow Private or already liked/followed/follows you}`
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
    } while (tags.moreAvailable);
    print(`Status: All Task done!`, "ok", true);
  } catch (err) {
    print(err, "err");
  }
})();
//by 1dcea8095a18ac73b764c19e40644b52 116 111 111 108 115 105 103  118 51 