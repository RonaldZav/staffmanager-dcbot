const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const megadb = require("megadb");
const messages = require('../../config/messages.json');

module.exports = {
    name: "info",
    default_member_permissions: ["Administrator"],
    description: "Ver información de un miembro.",
    options: [
        { name: "miembro", description: "Selecciona a un miembro", type: ApplicationCommandOptionType.User, required: true }
    ],
        
    run: async (client, interaction) => {

        const member = interaction.options.getUser('miembro');

        let db = new megadb.crearDB({ nombre: "score", carpeta: "storage" });
        let strikesDB = new megadb.crearDB({ nombre: "strikes", carpeta: "storage" });
        const score = await db.obtener(member.id + '-score', "-") || "0";
        const strikes = await strikesDB.obtener(member.id + '-strikes', "-") || "0";

        const guild = interaction.guild;
        
        if (!guild) {
            return interaction.reply("Este comando solo puede ser utilizado en un servidor.");
        }
        
        const guildMember = await guild.members.fetch(member);
        
        if (!guildMember) {
            return interaction.reply("No se pudo obtener información del miembro.");
        }
        
        const joinedAt = guildMember.joinedAt;
        
        if (!joinedAt) {
            return interaction.reply("No se pudo obtener la fecha de ingreso del miembro.");
        }

        const currentDate = new Date();
        const timeDifference = currentDate - joinedAt;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        const timeOld =
            (years > 0 ? years + (years === 1 ? " año" : " años") : "") +
            (remainingMonths > 0 ? (years > 0 ? ", " : "") + remainingMonths + (remainingMonths === 1 ? " mes" : " meses") : "") +
            (days > 0 && years === 0 && remainingMonths === 0 ? days + (days === 1 ? " día" : " días") : "");

        const embed = new EmbedBuilder()
            .setTitle(`Info de ${guildMember.user.username}`)
            .setColor(client.embedColor)
            .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setFooter({ text: messages.footer })
            .setDescription(`**Puntos:** ${score}\n**Antigüedad:** ${timeOld}\n**Strikes**: ${strikes}`);
        
        interaction.reply({ embeds: [embed] });
    }
};
