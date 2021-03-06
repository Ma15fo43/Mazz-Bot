import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest-ts";

// Scratch command

/**
 * Shows information about a Scratch project.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "scproj",
	description: "Shows information about a Scratch project",
	options: [
        {
            name: "id",
            type: "STRING",
            description: "The project ID",
            required: true
        },
	],

	execute(Client: Discord.Client, message: Discord.Message, args, ops) {
		let project: string = args[0];
		const xhttp: any = new XMLHttpRequest();
	
		if (project.startsWith("https://")) {
			let projectLink = project.split("https://scratch.mit.edu/projects")[1];
			project = projectLink;
		}
	
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				const parsedRequest = JSON.parse(this.responseText);
				let sharedDate = this.responseText.split('"shared":"')[1].split(`T`)[0];
				let sharedHour = this.responseText.split(`"shared":"${sharedDate}T`)[1].split('.000Z"}')[0];
	
				const requestedProject: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle(`Information about ${parsedRequest.title}`)
					.setAuthor(message.member.user.username, message.member.user.avatarURL())
					.setURL(`https://scratch.mit.edu/projects/${project}/`)
					.setThumbnail(message.member.user.avatarURL())
					.setImage(parsedRequest.image)
					.setDescription(`**${parsedRequest.title}** by *${parsedRequest.author.username}*`)
					.addField("Number of :eye:", `**${parsedRequest.stats.views}** views.`)
					.addField("Number of :heart:", `**${parsedRequest.stats.loves}** loves.`)
					.addField("Number of :star:", `**${parsedRequest.stats.favorites}** stars.`)
					.addField("Are :speech_balloon: allowed?", `Comments are **${parsedRequest.comments_allowed == true ? "allowed" : "not allowed"}**.`)
					.addField("Number of :cyclone:", `**${parsedRequest.stats.remixes}** remixes.`)
					.addField("Sharing date", "Project shared on **" + `${new Date(parsedRequest.history.shared).toLocaleDateString()}` + "** at **" + `${new Date(parsedRequest.history.shared).toLocaleTimeString()}` + "**.")
					.setTimestamp()
					.setColor("#FF8000")
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.reply({ embeds: [requestedProject] });
			} else if (this.readyState == 4 && this.responseText == "{\"code\":\"NotFound\",\"message\":\"\"}") {
				message.reply("I did not find the project you requested.");
			}
		}
	
		xhttp.open("GET", `https://api.scratch.mit.edu/projects/${project}/`, true);
		xhttp.send();
	}
}
