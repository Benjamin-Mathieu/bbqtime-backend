const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");
const Order = require("../models/Order");

const headers = {
    "Content-type": "application/json",
    "api-key": process.env.API_SENDINBLUE_KEY,
    accept: "application/json",
};
const email = {
    sendEmailInvitation: async (mailUser, event_id) => {
        try {
            const event = await Event.findByPk(event_id, { include: { model: User } });
            const dateEvent = new Date(event.date);
            const d = dateEvent.getDate();
            const m = dateEvent.getMonth();
            const y = dateEvent.getFullYear();

            const date = `${d}/${m}/${y}`;

            await email.sendEmail(mailUser, "Invitation à un évènement !",
                `<h2>Vous êtes invités à l'évènement ${event.name} de ${event.user.name} ${event.user.firstname} !</h2>
                <div>
                    <ul>
                        <li>Adresse: ${event.address} ${event.zipcode} ${event.city} </li>
                        <li>Date: ${date}</li>
                    </ul>
                    <p>"${process.env.LOGO_PATH}logo1.png"</p>
                    <img src="${process.env.LOGO_PATH}logo1.png" alt="logo-bbqtime" />
                    <p>Pour rejoindre l'évènement, ouvrez l'application et rentrez le code suivant: <b>${event.password}</b></p>
                    <p>ou scanner ce qrcode: <img src="${event.qrcode}"/>
                </div>
                `)
        } catch (error) {
            throw error;
        }
    },

    sendEmailPreventAdminAdd: async (mailUser, event_id, new_user, pass_new_user) => {
        try {
            const event = await Event.findByPk(event_id, { include: { model: User } });
            if (new_user) {
                await email.sendEmail(mailUser, `BBQ-Time: Ajout administrateur par ${event.user.name} ${event.user.firstname}`,
                    `<h2>Vous êtes administrateur sur l'évènement ${event.name} de ${event.user.name} ${event.user.firstname} !</h2>
                <div>
                    <p>Veuillez-vous connectez avec ses identifiants : </b></p>
                    <p>E-mail : ${new_user.email} Mot de passe : ${pass_new_user}</p>
                </div>
                <div>
                    <p>Vous pourrez ensuite accéder à l'évènement et gérer les commandes dans la catégorie "Mes évènements"</b></p>
                </div>
                `);
            } else {
                await email.sendEmail(mailUser, `BBQ-Time: Ajout administrateur par ${event.user.name} ${event.user.firstname}`,
                    `<h2>Vous êtes administrateur sur l'évènement ${event.name} de ${event.user.name} ${event.user.firstname} !</h2>
                <div>
                    <p>Vous pouvez dès à présent accéder à l'évènement et gérer les commandes dans la catégorie "Mes évènements"</b></p>
                </div>
                `);
            }
        } catch (error) {
            throw error;
        }
    },

    sendEmailResetPassword: async (mailUser) => {
        try {
            const rInt = (min, max) => {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            const code = rInt(100000, 999999);

            await email.sendEmail(mailUser, "Demande de réinitialisation du mot de passe",
                `<div>Veuillez entrer le code suivant dans l'application: <b>${code}</b></div>`);

            return code;
        } catch (error) {
            throw error;
        }
    },

    async sendEmail(email, subject, htmlContent) {
        try {
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
        } catch (error) {
            console.error(error);
        }
    },
}

module.exports = email;