const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");
const Order = require("../models/Order");


const headers = {
    "Content-type": "application/json",
    "api-key": process.env.API_SENDINBLUE_KEY,
    accept: "application/json",
};
const service = {
    sendEmailInvitation: async (email, event_id) => {
        try {
            const event = await Event.findByPk(event_id, { include: { model: User } });

            await service.sendEmail(email, "Invitation à un évènement !",
                `<h2>Vous êtes invités à l'évènement ${event.name} de ${event.user.name} ${event.user.firstname} !</h2>
                <div>
                    <ul>
                        <li>Adresse: ${event.address} ${event.zipcode} ${event.city} </li>
                        <li>Date: ${event.date}</li>
                    </ul>
                    <p>Pour rejoindre l'évènement, ouvrez l'application et rentrez le code suivant: <b>${event.password}</b></p>
                    <p>ou scanner ce qrcode: <img src="${event.qrcode}"/>
                </div>
                `)
        } catch (error) {
            throw error;
        }
    },

    sendEmailPreventAdminAdd: async (email, event_id) => {
        try {
            const event = await Event.findByPk(event_id, { include: { model: User } });

            await service.sendEmail(email, `BBQ-Time: Ajout administrateur par ${event.user.name} ${event.user.firstname}`,
                `<h2>Vous êtes administrateur sur l'évènement ${event.name} de ${event.user.name} ${event.user.firstname} !</h2>
                <div>
                    <p>Vous pouvez dès à présent accéder à l'évènement et gérer les commandes dans la catégorie "Mes évènements"</b></p>
                </div>
                `)
        } catch (error) {
            throw error;
        }
    },

    sendEmailResetPassword: async (user_email) => {
        try {
            const rInt = (min, max) => {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            const code = rInt(100000, 999999);

            await service.sendEmail(user_email, "Demande de réinitialisation du mot de passe",
                `<div>Veuillez entrer le code suivant dans l'application: <b>${code}</b></div>`);

            return code;
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