require("dotenv").config();

module.exports = {
    token: process.env.TOKEN,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    ownerID: "749005619800965121", // Id del dueño
    guildId: "1144762157041459321", // Id del dueño
    embedColor: "#8645ff", // Color de los embeds
    customActivity: "mahiro.online", // Estado del bot
    evidences: "1144763005540761631", // Id del canal donde se enviaran las evidencias.
    waitingChannel: "1144763219915853877", // Id del canal donde las evidencias esperan ser aprobadas.
    alerts: "1144763123501375498", // Id del canal donde llegaran las alertas.
    scoreEvidenceAccept: "5", // Cantidad de puntos a sumar por evidencia aceptada
    scoreEvidenceDeny: "0", // Cantidad de puntos a restart por evidencia rechazada
    maxStrikes: "3", // Cantidad de strikes para sancionar al staff.
}

function parseBoolean(value) { if (typeof (value) === 'string') { value = value.trim().toLowerCase(); }
switch (value) { case true: case "true": return true; default: return false; }}
