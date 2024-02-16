const { PermissionsBitField, CommandInteraction, ButtonBuilder, ButtonStyle, ChannelType, InteractionType, ActionRowBuilder, SelectMenuBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const RonaldZav = require("../../structures/Client");
const megadb = require('megadb');

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => { const settings = await client.settings; const messages = settings.messages;

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const embed = new EmbedBuilder().setColor("Red");

      if (command.botPerms) { if (!interaction.guild.members.me.permissions.has( PermissionsBitField.resolve(command.botPerms || [])))
		{
          embed.setDescription(`No tengo el permiso **\`${command.botPerms}\`** en ${interaction.channel.toString()} para hacer esto.**`);
          return interaction.reply({ embeds: [embed] });
        }}

      if (command.userPerms) { if (!interaction.member.permissions.has( PermissionsBitField.resolve(command.userPerms || []))) 
	  {
          embed.setDescription(`No tienes el permiso**\`${command.userPerms}\`**${interaction.channel.toStrinf()} para usar **\`${command.name}\`** command.`);
          return interaction.reply({ embeds: [embed] });
      }}


      try { await command.run(client, interaction, "!"); } catch (error) {
        if (interaction.replied) { await interaction.editReply({ content: `¡Ocurrio un error! Avisa al equipo de Soporte` }).catch(() => {});
        } else { await interaction.reply({ ephemeral: true, content: `¡Ocurrio un error! Avisa al equipo de Soporte` }).catch(() => {}); }
        console.error(error); }}

        /* Sistema de puntos */
  let db = new megadb.crearDB({ nombre: "score", carpeta: "storage" });

	const score = await db.obtener(interaction.member.id + '-score', "-") || "0";


      let evidenceAcceptDisabled = new ButtonBuilder().setCustomId("evidenceAccept").setLabel("✅ Aprobar").setStyle(ButtonStyle.Success).setDisabled(true);
      let evidenceDenyDisabled = new ButtonBuilder().setCustomId("evidenceDeny").setLabel("⛔ Rechazar").setStyle(ButtonStyle.Danger).setDisabled(true);
        
        

        if(interaction.isButton() && interaction.customId.startsWith("evidenceAccept")){

          const staffId = interaction.customId.replace('evidenceAccept-', '');
          const staff = await interaction.guild.members.fetch(staffId);

          const result = parseInt(score) + parseInt(settings.score.evidenceAccept);
          db.establecer(staffId, {score: result}, "-"); 

          interaction.message.edit({ components: [new ActionRowBuilder().addComponents(evidenceAcceptDisabled, evidenceDenyDisabled)] });
          interaction.reply({ content: `Evidencia aprobada, se le sumaron ${settings.score.evidenceAccept} puntos al staff ${staff}.` })
       
        }

        if(interaction.isButton() && interaction.customId.startsWith("evidenceDeny")){
          
          const staffId = interaction.customId.replace('evidenceDeny-', '');
          const staff = await interaction.guild.members.fetch(staffId);

          const result = parseInt(score) - parseInt(settings.score.evidenceDeny);
          db.establecer(staffId, {score: result}, "-"); 

          interaction.message.edit({ components: [new ActionRowBuilder().addComponents(evidenceAcceptDisabled, evidenceDenyDisabled)] });
          interaction.reply({ content: `Evidencia rechazada, se le quitaron ${settings.score.evidenceDeny} puntos al staff ${staff}.` })

        }

 }};
