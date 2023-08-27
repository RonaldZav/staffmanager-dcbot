const { PermissionsBitField, CommandInteraction, ButtonBuilder, ButtonStyle, ChannelType, InteractionType, ActionRowBuilder, SelectMenuBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const MahiroStudios = require("../../structures/Client");
const messages = require('../../config/messages.json');
const { intersection } = require("lodash");
const megadb = require('megadb');

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {

    if(message.channelId === client.evidences && message.author.id !== client.user.id){

        if(!message.attachments.size > 0){ 
            
            message.reply({ content: `${message.author} No ingresaste ninguna foto y/o video adjunto al mensaje. Tu evidencia no ha sido enviada.` }).then(reply => {

                message.delete();
                setTimeout(() => { reply.delete(); }, 8000);

              }).catch(error => { console.error("Error al enviar o eliminar el mensaje:", error); });
        
        } else {

            let accept = new ButtonBuilder().setCustomId("evidenceAccept-" + message.author.id).setLabel("✅ Aprobar").setStyle(ButtonStyle.Success);
            let deny = new ButtonBuilder().setCustomId("evidenceDeny-" + message.author.id).setLabel("⛔ Rechazar").setStyle(ButtonStyle.Danger);
            

            const embed = new EmbedBuilder()
            .setTitle(messages.title)
            .setDescription(`**Descripción:** ${message.content}`)
            .setColor(client.embedColor)
            .setFooter({ text: messages.footer });

            const text = message.content;
            const attachments = message.attachments;

            const attachmentLinks = [];

            attachments.forEach((attachment) => {
                attachmentLinks.push(attachment.url);
            });

            const channel = client.channels.cache.get(client.waitingChannel);

            channel.send({ embeds: [embed], files: attachmentLinks, components: [new ActionRowBuilder().addComponents(accept, deny)] });
            setTimeout(() => { message.delete(); }, 300);
        };
    };

  }};