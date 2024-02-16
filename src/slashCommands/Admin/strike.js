const { Discord, WebhookClient, PermissionsBitField, ActionRowBuilder, MessageActionRow, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js");
const megadb = require('megadb'); 

module.exports = {
    name: "strike",
	default_member_permissions: ["Administrator"],
    description: "Añadirle un strike a un miembro.",
	options: [
		{ name: "miembro", description: "Selecciona a un staff.", type: ApplicationCommandOptionType.User, required: true },
	],
		
    run: async (client, interaction) => { const settings = await client.settings; const messages = settings.messages;
        
        const member = interaction.options.getUser('miembro');

        let db = new megadb.crearDB({ nombre: "strikes", carpeta: "storage" });

        const actualStrikes = await db.obtener(member.id + '-strikes', "-") || 0;

        async function strikeReset ({member}) {
            db.establecer(member.id, {strikes: 0}, "-"); 
        };

        async function alertCreate ({member}) {

            const embed = new EmbedBuilder()
            .setTitle(messages.title)
            .setDescription(`El staff ${member} alcanzo el maximo de strikes.`)
            .setFooter({ text: messages.footer })
            .setColor(client.embedColor)

            const channel = await client.channels.fetch(client.alerts);
            channel.send({ embeds: [embed] });
            interaction.reply({ content: `El staff ${member} alcanzo el maximo de strikes, se envio un aviso a <#${client.alerts}>` });
        };


        async function strikeCreate ({member, actualStrikes, maxStrikes}) {

            const newStrikes = actualStrikes + 1;

            db.establecer(member.id, {strikes: newStrikes}, "-"); 

            const embed = new EmbedBuilder()
            .setTitle(messages.title)
            .setDescription(`El staff ${member} a recibido un strike. Ahora tiene ${newStrikes}/${maxStrikes}`)
            .setFooter({ text: messages.footer })
            .setColor(client.embedColor)

            interaction.reply({ embeds: [embed] });

        };


        if(actualStrikes >= settings.strikes.limit){ alertCreate({ member: member }); strikeReset({ member: member }) } else {
        strikeCreate({ member: member, actualStrikes: actualStrikes, maxStrikes: settings.strikes.limit })
        };
}};
