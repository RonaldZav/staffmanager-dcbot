const { Discord, WebhookClient, PermissionsBitField, ActionRowBuilder, MessageActionRow, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "rank",
	default_member_permissions: ["Administrator"],
    description: "Agregar/quitar un rol a un miembro.",
	options: [
		{ name: "miembro", description: "Selecciona a un miembro", type: ApplicationCommandOptionType.User, required: true },
		{ name: "rango", description: "Selecciona un rol para añadirselo/quitarselo", type: ApplicationCommandOptionType.Role, required: true }
	],
		
    run: async (client, interaction) => { const settings = await client.settings; const messages = settings.messages;
        
        const member = interaction.options.getUser('miembro');
        const role = interaction.options.getRole('rango');

        if (!member || !role) {
            return interaction.reply("No se proporcionaron miembro o rango válidos.");
        }

        try {
            const fetchedMember = await interaction.guild.members.fetch(member);
            if (!fetchedMember) {
                return interaction.reply("No se pudo obtener información del miembro.");
            }

            const memberRoles = await fetchedMember.roles.cache;
            if (memberRoles.some(r => r.id === role.id)) {
                await fetchedMember.roles.remove(role);
                interaction.reply(`Se le quitó el rol ${role} a ${fetchedMember.user}.`);
            } else {
                await fetchedMember.roles.add(role);
                interaction.reply(`Se le agregó el rol ${role} a ${fetchedMember.user}.`);
            }
        } catch (error) {
            console.error("Error al agregar/quitar el rol:", error);
            interaction.reply("Hubo un error al procesar la solicitud.");
        }

}};
