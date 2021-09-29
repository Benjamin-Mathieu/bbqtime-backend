const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");

const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Basic ${process.env.API_ONESIGNAL_KEY}`
};

const message = {
    app_id: process.env.APPID_ONESIGNAL,
    contents: { "en": "" },
    include_external_user_ids: []
};

const serviceNotification = {
    sendNotificationNewOrder: async (event_id) => {
        try {
            const event = await Event.findByPk(event_id, { include: { model: User } });
            const userId = event.user.id.toString();
            console.log("userId", userId);

            message.contents.en = `Une nouvelle commande a été passée sur votre évènement ${event.name}`
            message.include_external_user_ids.push(userId.toString());
            console.log("message =>", message);

            await serviceNotification.sendNotification(message);
        } catch (error) {
            throw error;
        }
    },
    sendNotification: async (data) => {
        try {
            const req = await axios({
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                url: "https://onesignal.com/api/v1/notifications",
                method: "POST",
                headers,
                data
            });
            console.log(req);
        } catch (error) {
            throw error;
        }
    },

};

module.exports = serviceNotification;