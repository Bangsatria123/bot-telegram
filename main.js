const TelegramBot = require("node-telegram-bot-api");
const token = "8127899842:AAGIIiMN-bQzfz-CDSSQFVq1HXltJ29Z8Fw";

const bot = new TelegramBot(token, { polling: true });
const prefix = ".";

const Start = new RegExp(`^${prefix}start$`);
const List = new RegExp(`^${prefix}Admin$`);
// const Tagall = new RegExp(`^${prefix}Tagall`)
const Delete = new RegExp(`^${prefix}del$`);
const Ban = new RegExp(`^${prefix}ban$`);
const Pin = new RegExp(`^${prefix}pin$`);
const Unpin = new RegExp(`^${prefix}unpinAll$`);
const Send = new RegExp(`^${prefix}send `)
const Run = new RegExp(`^${prefix}run$`)

async function IsAdmin(chatId, userId) {
  try {
    const admin = await bot.getChatAdministrators(chatId);
    return admin.some((admins) => admins.user.id === userId);
  } catch (error) {
    console.log(error);
  }
}

bot.onText(Start, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const adminCheck = await IsAdmin(chatId, userId);
  if (adminCheck) {
    bot
      .sendMessage(chatId, `Hi,bot berhasil dimuat ulang`)
      .then(bot.deleteMessage(chatId, msg.message_id));
  } else {
    bot.deleteMessage(chatId, msg.message_id);
  }
});

bot.onText(List, async (msg) => {
  const chatId = msg.chat.id;
  const userID = msg.from.id;
  const GetAdmin = await bot.getChatAdministrators(chatId);
  const Map = GetAdmin.map((admin) => `@${admin.user.username}`).join(",\n");
  const isSplit = Map.split(5, 100);
  const adminCheck = await IsAdmin(chatId, userID);
  if (adminCheck) {
    console.log(isSplit);
    bot
      .sendMessage(chatId, `ADMIN TAG :\n ${isSplit}`)
      .then(bot.deleteMessage(chatId, msg.message_id));
  } else {
    bot.deleteMessage(chatId, msg.message_id);
  }
});
bot.onText(Delete, async (msg) => {
  const chatId = msg.chat.id;
  const userID = msg.from.id;
  const userid = msg.from.username;
  const adminCheck = await IsAdmin(chatId, userID);
  if (adminCheck) {
    if (msg.reply_to_message) {
      const msgId = msg.reply_to_message.message_id;
      const text = msg.reply_to_message.text;
      const sender = msg.reply_to_message.from.username
      const deleter = msg.from.username
      bot
        .deleteMessage(chatId, msgId)
        .then(bot.deleteMessage(chatId, msg.message_id))
        .then(
          console.log(`${text} from @${sender} deleted by @${deleter}`)
        )
    } else {
      console.log(error);
    }
  } else {
    bot.deleteMessage(chatId, msg.message_id);
  }
});

bot.onText(Pin, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const admincheck = await IsAdmin(chatId, userId);
  if (admincheck) {
    if (msg.reply_to_message) {
      bot
        .pinChatMessage(chatId, msg.reply_to_message.message_id)
        .then(bot.deleteMessage(chatId, msg.message_id));
    }
  } else {
    console.log("ERROR BLOG");
  }
});

bot.onText(Unpin, async (msg) => {
  {
    const chatId = msg.chat.id;
    const userId = msg.from.user;
    const adminCheck = await IsAdmin(chatId, userId);

    if (adminCheck) {
      try {
        bot
          .unpinAllChatMessages(chatId)
          .then(bot.deleteMessage(chatId, msg.message_id));
      } catch (error) {
        bot.sendMessage(chatId, error);
      }
    }
  }
});

bot.onText(Ban, async (msg) => {
  const chatId = msg.chat.id;
  const userid = msg.from.username;
  const userID = msg.from.id;
  const adminCheck = await IsAdmin(chatId, userID);

  if (adminCheck) {
    if (msg.reply_to_message) {
      Banreply(msg, chatId);
    }
  }
});

const Banreply = async (msg, chatId) => {
  const userid = msg.from.id;
  const name = msg.from.username;
  try {
    await bot.banChatMember(chatId, userid);
    bot.sendMessage(chatId, `anda di ban oleh admin ${name}`);
  } catch (error) {
    console.error(error);
  }
};


bot.onText(Send, async(msg)=>{
  const chatId= msg.chat.id
  const userId = msg.text;
  const user = msg.from.id

  const adminCheck = await IsAdmin(chatId, user)

  if(adminCheck){
    bot.sendMessage(chatId, `${userId.trim().split(/\s+/).slice(1).join(" ")}`)
    .then(bot.deleteMessage(chatId,msg.message_id))
    .then(console.log(`${msg.from.username}`))
  }
})

bot.onText(Run, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id

  const adminCheck = await IsAdmin(chatId, userId);

  if(adminCheck){
  setInterval(() => {
    bot.sendMessage(chatId, 'Pesan ini dikirim setiap 5 detik!')
    .then(msg => {
      setTimeout(()=>{
        bot.deleteMessage(chatId, msg.message_id)
      },1000 * 1800)
    });
  }, 1000 * 3600)}
});

bot.on(`message`, (msg)=>{
  const chatId = msg.chat.id
  const userid = msg.from.user 
  const message = `maaf @${msg.from.username} pesan anda mengandung kata kata terlarang`
  const banChat = ["bio", "hallo", "hai"]
  const isBanned = banChat.some(banWord => msg.text.includes(banWord))
    if (isBanned) {
      bot.deleteMessage(chatId, msg.message_id)
      .then(() => {
        bot.sendMessage(chatId, message)
        .then(msg =>{
          setTimeout(()=>{
            bot.deleteMessage(chatId, msg.message_id)
          },5000)
        })
      })
        }
    })




