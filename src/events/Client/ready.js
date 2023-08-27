const { PermissionsBitField, CommandInteraction, ButtonBuilder, ButtonStyle, ChannelType, InteractionType, ActionRowBuilder, SelectMenuBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const MahiroStudios = require("../../structures/Client");
const fs = require("fs");
const { prefix } = require("../../config/client.js");
const messages = require('../../config/messages.json');
const { messageId } = require("../../storage/firstTime.json");
const { Activity } = require("discord.js");

module.exports ={
name: "ready",
run: async (client) => {
	
    client.manager.init(client.user.id);
    client.logger.log(`Sesion iniciada en ${client.user.username}`, "ready");
    client.logger.log(`Servidores: ${client.guilds.cache.size}, Miembros: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`, "ready");

  		client.user.setActivity(client.customActivity, {type: Activity.Watching});

    const guild = await client.guilds.fetch(client.guildId);
    const channel = guild.channels.cache.get(client.evidences);
    
    client.logger.log(`Creando mensajes necesarios...`, "ready");

    const embed = new EmbedBuilder()
            .setTitle(messages.title)
            .setDescription(messages.evidencesEmbedPanel)
            .setColor(client.embedColor)
            .setFooter({ text: messages.footer });

    try {
        
        
        const existingMessage = await channel.messages.fetch(messageId);
        client.logger.log(`Los mensajes existen, omitiendo creacion de mensajes.`, "ready");

    } catch (error) {
    
        channel.send({ embeds: [embed] }).then(message => {
            
            const Dir = "./src/storage/firstTime.json";

            const jsonData = JSON.stringify({messageId: message.id}, null, 2);
            fs.writeFileSync(Dir, jsonData);

        })
        .catch(error => {
            client.logger.log(`Ocurrio un error creando los mensajes: ${error}`, "error");
        });
        


        client.logger.log(`Se crearon los mensajes necesarios.`, "ready");
    };

    }}