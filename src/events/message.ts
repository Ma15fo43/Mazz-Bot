import * as Discord from "discord.js";
import * as Fs from "fs";

import * as Logger from "./../utils/Logger";
import * as Xp from "./../utils/Xp";

export default async (Client: Discord.Client, message: Discord.Message) => {
	if (message.author.bot || !message.guild) {
		return;
	}

	let prefix = JSON.parse(Fs.readFileSync(`./database/prefixes/prefixes.json`, "utf8"));

	if (message.content == `<@!${Client.user.id}>`) {
		if (prefix[message.author.id] == undefined) {
			prefix = "!";
		} else {
			prefix = prefix[message.author.id];
		}
		message.reply(`Hey, I'm Mango! Your current prefix is \`${prefix}\` \n→ help message: \`${prefix}infohelp\` <a:check:690888185084903475>`);
	}

	Xp.checkXP(message);

	Fs.readFile(`./database/prefixes/prefixes.json`, "utf8", (err: Error, data): void => {
		data = JSON.parse(data);
		const prefix: string = data[message.author.id] == undefined ? "?" : data[message.author.id];

		const msg: string = message.content;
		const args: string[] = message.content.slice(prefix.length).trim().split(" ");
		const cmd: string = args.shift().toLowerCase();

		if (!msg.startsWith(prefix)) {
			return;
		}

		try {
			require(`./../commands/${cmd}.js`).run(Client, message, args, null);
			Logger.log(`${message.author.tag} just used the ${cmd} power in ${message.guild.name}.`);
		} catch (err) {
			Logger.log(`The command ${message.author.tag} tried to call in ${message.guild.name} doesen't seem to exist.`);
		}

	});
};
