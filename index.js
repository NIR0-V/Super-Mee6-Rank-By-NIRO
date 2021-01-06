let Discord = require("discord.js")
let client = new Discord.Client()
let Enmap = require("enmap")
let canvacord = require("canvacord")
client.points = new Enmap({ name: "points" })
client.login(process.env.TOKEN)
let prefix = process.env.PREFIX;

client.on('ready', () => {
console.log(`Iam Ready`);
console.log(`server : ${client.guilds.cache.size}`)
console.log(`channel : ${client.channels.cache.size}`)
console.log(`users : ${client.users.cache.size}`)
console.log(`${client.user.tag}`)
console.log(`bot id : ${client.user.id}`)
client.user.setActivity(`${prefix}rank`,`PLAYING`)
client.user.setStatus(`dnd`)
 })

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.channel.type === `dm`) return;

    const key = `${message.guild.id}-${message.author.id}`;
    client.points.ensure(`${message.guild.id}-${message.author.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });

    var msgl = message.content.length / (Math.floor(Math.random() * (message.content.length - message.content.length / 100 + 1) + 10));

    if (msgl < 10) {
   
      var randomnum = Math.floor((Math.random() * 2) * 100) / 100
  
      client.points.math(key, `+`, randomnum, `points`)
      client.points.inc(key, `points`);
    }
 
    else {
    
      var randomnum = 1 + Math.floor(msgl * 100) / 100
     
      client.points.math(key, `+`, randomnum, `points`)
      client.points.inc(key, `points`);
    }
    
    const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, `points`)));

    if (client.points.get(key, `level`) < curLevel) {
 
      const embed = new Discord.MessageEmbed()
        .setTitle(`Ranking of:  ${message.author.username}`)
        .setTimestamp()
        .setDescription(`You've leveled up to Level: **\`${curLevel}\`**! (Points: \`${Math.floor(client.points.get(key, `points`) * 100) / 100}\`) `)
        .setColor("GREEN");
    
      message.channel.send(`<@` + message.author.id + `>`);
      message.channel.send(embed);

      client.points.set(key, curLevel, `level`);
    }
  
    if (message.content.toLowerCase().startsWith(prefix + `rank`)) {
      console.error(`
      
███╗░░██╗██╗██████╗░░█████╗░  ░█████╗░███╗░░██╗██████╗░  ██╗░░██╗██╗██████╗░░█████╗░
████╗░██║██║██╔══██╗██╔══██╗  ██╔══██╗████╗░██║██╔══██╗  ██║░░██║██║██╔══██╗██╔══██╗
██╔██╗██║██║██████╔╝██║░░██║  ███████║██╔██╗██║██║░░██║  ███████║██║██████╔╝██║░░██║
██║╚████║██║██╔══██╗██║░░██║  ██╔══██║██║╚████║██║░░██║  ██╔══██║██║██╔══██╗██║░░██║
██║░╚███║██║██║░░██║╚█████╔╝  ██║░░██║██║░╚███║██████╔╝  ██║░░██║██║██║░░██║╚█████╔╝
╚═╝░░╚══╝╚═╝╚═╝░░╚═╝░╚════╝░  ╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░  ╚═╝░░╚═╝╚═╝╚═╝░░╚═╝░╚════╝░
`)
      let rankuser = message.mentions.users.first() || message.author;
      client.points.ensure(`${message.guild.id}-${rankuser.id}`, {
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1
      });

      const filtered = client.points.filter(p => p.guild === message.guild.id).array();
      const sorted = filtered.sort((a, b) => b.points - a.points);
      const top10 = sorted.splice(0, message.guild.memberCount);
      let i = 0;
    
      for (const data of top10) {
        await delay(15);
        try {
          i++;
          if (client.users.cache.get(data.user).tag === rankuser.tag) break;
        } catch {
          i = `Error counting Rank`;
          break;
        }
      }
      const key = `${message.guild.id}-${rankuser.id}`;

      let curpoints = Number(client.points.get(key, `points`).toFixed(2));
     
      let curnextlevel = Number(((Number(1) + Number(client.points.get(key, `level`).toFixed(2))) * Number(10)) * (( Number(1) + Number(client.points.get(key, `level`).toFixed(2))) * Number(10)));
    
      if (client.points.get(key, `level`) === undefined) i = `No Rank`;
     
      let tempmsg = await message.channel.send(
        new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(`Loding...`,`https://cdn.discordapp.com/emojis/769935094285860894.gif`))

      let color;
      let x = ["dnd","idle","online","streaming"]
      let x3 = Math.floor(Math.random() * x.length);
      const rank = new canvacord.Rank()

        .setAvatar(rankuser.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setCurrentXP(Number(curpoints.toFixed(4)), "#EFFBFB")
        .setRequiredXP(Number(curnextlevel.toFixed(2)),"#585858")
        .setStatus(`${x[x3]}`, true, 7)
        .renderEmojis(true)
        .setProgressBar("#2EFEF7")
        .setRankColor("#EFFBFB")
        .setLevelColor("#EFFBFB")
        .setUsername(rankuser.username, "#EFFBFB")
        .setRank(Number(i), "Rank", true)
        .setLevel(Number(client.points.get(key, `level`)), "LEVEL", true)
        .setDiscriminator(rankuser.discriminator, color);
      rank.build()
        .then(async data => {
      
          const attachment = new Discord.MessageAttachment(data, "NiroCard.png");
          
          const embed = new Discord.MessageEmbed()
            .setTitle(`Ranking of:  ${rankuser.username}`)
            .setColor("#2EFEF7")
            .setImage("attachment://NiroCard.png")
            .attachFiles(attachment)
        
          await message.channel.send(embed);
         
          await tempmsg.delete();
          return;
        });
    }
  })
  function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
