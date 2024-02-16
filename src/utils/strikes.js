const { Settings, Messages } = require("./settings")

module.exports = class Strikes {
	static maxStrikesAlert (member) {

            const embed = new EmbedBuilder()
            .setTitle(Messages.embed.title)
            .setDescription(Messages.maxStrikes.public.replace("<member>", `<@${member}>`))
            .setFooter({ text: Messages.bot.footer })
            .setColor(Settings.bot.embedColor)

            const msg = Messages.maxStrikes.reply.replace("<member>", `<@${member}>`).replace("<alertsChannel>", `<#${Settings.channels.alerts}`);
            
            return { embed, msg };
	};


};