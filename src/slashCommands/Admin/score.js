const { Discord, WebhookClient, PermissionsBitField, ActionRowBuilder, MessageActionRow, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js")
const messages = require('../../config/messages.json');
const megadb = require('megadb');

/* 
	Developed by @RonaldZav in
	Mahiro Studios, visit us
	website on https://mahiro.online 
*/

module.exports = {
    name: "score",
	default_member_permissions: ["Administrator"],
    description: "Cambiar puntos de un staff.",
	options: [
		{ name: "miembro", description: "Selecciona a un miembro del staff.", type: ApplicationCommandOptionType.User, required: true },
		{ name: "opcion", description: "Selecciona una de las opciones.", type: ApplicationCommandOptionType.String, required: true, choices: [
			{
				name: "agregar",
				value: "add"
			},
			{
				name: "quitar",
				value: "take"
			},
			{
				name: "establecer",
				value: "set"
			}]},
		{ name: "valor", description: "Ingresa un número.", type: ApplicationCommandOptionType.String, required: true }
	],
		
    run: async (client, interaction) => { //await interaction.deferReply({ ephemeral: true });
	
	const miembro = interaction.options.getUser('miembro');
	const opcion = interaction.options.getString('opcion');
	const valor = interaction.options.getString('valor');
	
	let db = new megadb.crearDB({ nombre: "score", carpeta: "storage" });

	const score = await db.obtener(miembro.id + '-score', "-") || "0";

	const embed = new EmbedBuilder()
	.setTitle(messages.title)
	.setColor(client.embedColor)
	.setFooter({ text: messages.footer })
if(/^[0-9]+$/.test(valor)){
	if(opcion === "add") {
		embed.setDescription(`Se añadieron ${valor} puntos a ${miembro}`)
	
		const result = parseInt(score) + parseInt(valor);

		db.establecer(miembro.id, {score: result}, "-"); 
		interaction.reply({ embeds: [embed] });
	};

	if(opcion === "take") { embed.setDescription(`Se quitaron ${valor} puntos a ${miembro}`)

			if(Number(valor) <= score){
			const result = parseInt(score) - parseInt(valor);

			db.establecer(miembro.id, {score: result}, "-"); 
			interaction.reply({ embeds: [embed] });
			} else { interaction.reply({ content: `No puedes quitarle mas puntaje del que tiene, quedaria en numeros negativos.`, ephemeral: true })	
		}
	
	};

	if(opcion === "set") { embed.setDescription(`Se establecio en ${valor} los puntos de ${miembro}`)

	db.establecer(miembro.id, {score: valor}, "-"); 
	interaction.reply({ embeds: [embed] });
	};

} else {
	interaction.reply({ content: "Ingresaste un número no valido:" + "`" + valor + "`", ephemeral: true })
};

}};
