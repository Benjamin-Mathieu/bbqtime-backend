const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");

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
            const m = dateEvent.getMonth() + 1;
            const y = dateEvent.getFullYear();
            const h = dateEvent.getUTCHours();
            let min = dateEvent.getMinutes();
            if (min < 10) min = "0" + min;

            const date = `${d}/${m}/${y} à ${h}:${min}`;

            await axios.post(
                "https://api.sendinblue.com/v3/smtp/email",
                {
                    'templateId': 1,
                    'to': [{ email: mailUser }],
                    'params': {
                        "eventName": event.name,
                        "userName": event.user.name,
                        "userFirstname": event.user.firstname,
                        "eventAddress": event.address,
                        "eventDate": date,
                        "eventPassword": event.password,
                    },
                },
                {
                    headers,
                }
            );
        } catch (error) {
            throw error;
        }
    },

    sendEmailPreventAdminAdd: async (mailUser, event_id, new_user, pass_new_user) => {
        try {
            const event = await Event.findByPk(event_id, { include: { model: User } });

            if (new_user) {
                await axios.post(
                    "https://api.sendinblue.com/v3/smtp/email",
                    {
                        'templateId': 2,
                        'to': [{ email: mailUser }],
                        'params': {
                            "eventName": event.name,
                            "userName": event.user.name,
                            "userFirstname": event.user.firstname,
                            "newUserMail": new_user.email,
                            "newUserPassword": pass_new_user
                        },
                    },
                    {
                        headers,
                    }
                );
            } else {
                await axios.post(
                    "https://api.sendinblue.com/v3/smtp/email",
                    {
                        'templateId': 3,
                        'to': [{ email: mailUser }],
                        'params': {
                            "eventName": event.name,
                            "userName": event.user.name,
                            "userFirstname": event.user.firstname,
                        },
                    },
                    {
                        headers,
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    },

    sendEmailResetPassword: async (mailUser, codeInDb) => {
        try {

            if (codeInDb) {
                await axios.post(
                    "https://api.sendinblue.com/v3/smtp/email",
                    {
                        'templateId': 4,
                        'to': [{ email: mailUser }],
                        'params': {
                            "code": codeInDb
                        },
                    },
                    {
                        headers,
                    }
                );
            } else {
                const rInt = (min, max) => {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };

                const code = rInt(100000, 999999);

                await axios.post(
                    "https://api.sendinblue.com/v3/smtp/email",
                    {
                        'templateId': 4,
                        'to': [{ email: mailUser }],
                        'params': {
                            "code": code
                        },
                    },
                    {
                        headers,
                    }
                );

                return code;
            }

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