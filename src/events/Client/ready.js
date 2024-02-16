const { PermissionsBitField, CommandInteraction, ButtonBuilder, ButtonStyle, ChannelType, InteractionType, ActionRowBuilder, SelectMenuBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { messageId } = require("../../storage/firstTime.json");
const { Activity } = require("discord.js");

module.exports ={
name: "ready",
run: async (client) => { 
    
    const settings = await client.settings; 
    const messages = await settings.messages;
	
    client.logger.log(`Sesion iniciada en ${client.user.username}`, "ready");
    client.logger.log(`Servidores: ${client.guilds.cache.size}, Miembros: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`, "ready");

  		client.user.setActivity(client.customActivity, {type: Activity.Watching});

    const guild = await client.guilds.fetch(settings.bot.guild);
    const channel = await guild.channels.cache.get(settings.channels.evidences);
    
    client.logger.log(`Creando mensajes necesarios...`, "ready");

    const embed = new EmbedBuilder()
            .setTitle(messages.embed.title)
            .setDescription(messages.evidenceChannel.content)
            .setColor(settings.bot.embedColor)
            .setFooter({ text: messages.embed.footer });

    try {
        await channel.messages.fetch(messageId);
        client.logger.log(`Los mensajes existen, omitiendo creacion de mensajes.`, "ready");
    
    } catch (error) {
        channel.send({ embeds: [embed] }).then(message => {
            
            const Dir = "./src/storage/firstTime.json";

            const jsonData = JSON.stringify({messageId: message.id}, null, 2);
            fs.writeFileSync(Dir, jsonData);

        }).catch(error => { client.logger.log(`Ocurrio un error creando los mensajes: ${error}`, "error"); });
        
        client.logger.log(`Se crearon los mensajes necesarios.`, "ready");
    };

}}