const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");
const Order = require("../models/Order");
const Associate = require("../models/Associate");

const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Basic ${process.env.API_ONESIGNAL_KEY}`
};


const serviceNotification = {
    sendNotificationNewOrder: async (event_id) => {
        try {
            const event = await Event.findOne({ where: { id: event_id }, include: [Associate] });

            let ids = [event.user_id.toString()]; // array which contains ids of creator + all associates of event
            event.associate_events.forEach(associate => {
                ids.push(associate.user_id.toString());
            });

            const data = {
                app_id: process.env.APPID_ONESIGNAL,
                contents: { "en": `Une nouvelle commande a été passée sur votre évènement ${event.name}` },
                include_external_user_ids: ids
            };

            await serviceNotification.sendNotification(data);
        } catch (error) {
            throw error;
        }
    },

    sendNotificationOrderStatus: async (order_id) => {
        try {
            const order = await Order.findByPk(order_id, { include: { model: User } });
            const userId = order.user.id.toString();

            const data = {
                app_id: process.env.APPID_ONESIGNAL,
                contents: { "en": `Votre commande est préparée, vous pouvez venir la chercher !` },
                include_external_user_ids: [userId]
            };

            await serviceNotification.sendNotification(data);
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