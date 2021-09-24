const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");

const headers = {
    "Content-type": "application/json",
    "api-key": process.env.API_SENDINBLUE_KEY,
    accept: "application/json",
};

const service = {

    sendEmailInvitation: async (email, event_id) => {
        try {
            const event = await Event.findByPk(event_id, { include: { model: User } });
            const urlEvent = `http://192.168.1.47/event/join/${event.password}`;

            await service.sendEmail(email, "Invitation à un évènement !",
                `<h2>Vous êtes invités à l'évènement ${event.name} de ${event.user.name} ${event.user.firstname} !</h2>
                <div>
                    <ul>
                        <li>Adresse: ${event.address} ${event.zipcode} ${event.city} </li>
                        <li>Date: ${event.date}</li>
                    </ul>
                    <p>Pour rejoindre l'évènement cliquez sur le lien suivant: <a href="${urlEvent}">ici</a></p>
                    <p>ou scanner ce qrcode: <img src="${event.qrcode}"/>
                </div>
                `)
        } catch (error) {
            throw error;
        }
    },

    async sendEmail(email, subject, htmlContent) {
        await axios.post(
            "https://api.sendinblue.com/v3/smtp/email",
            {
                sender: {
                    name: "BBQ Time",
                    email: "ben88200@gmail.com",
                },
                to: [
                    {
                        email,
                    },
                ],
                subject,
                htmlContent,
            },
            {
                headers,
            }
        );
    },
}

module.exports = service;