import * as Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * A love meter between 2 members
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "lovemeter",
    description: "Calculates love % between to users",
    options: [
        { 
            name: "user",
            type: "USER",
            description: "The user you want to test the command with",
            required: true
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
        const member = message.type === "APPLICATION_COMMAND" ? Client.users.cache.get(args[0]) : Client.users.cache.get(message.mentions.members.first().id);

        const randomNumber = Math.floor(Math.random() * 10) + 1;
        let messageContent = "\n";

        for (let index = 0; index < randomNumber; index++) {
            messageContent += ":revolving_hearts:";
        }

        for (let index = 0; index < 10 - randomNumber; index++) {
            messageContent += ":black_large_square:";
        }

        const lovemeter = new Discord.MessageEmbed()
            .setTitle("Lovemeter :heart:")
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setColor("#08ABF9")
            .setDescription(`Current __lovemeter__ between you and *${member}*: ${messageContent} \n→ **${randomNumber * 10}**% of love`)
            .setFooter(Client.user.username, Client.user.avatarURL())
            .setTimestamp()

        message.reply({ embeds: [lovemeter] });
    }
}
