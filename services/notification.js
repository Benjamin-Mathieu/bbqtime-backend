const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");
const Order = require("../models/Order");

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

    sendNotificationOrderStatus: async (order_id) => {
        try {
            const order = await Order.findByPk(order_id, { include: { model: User } });
            const userId = order.user.id.toString();
            let status = "";

            switch (order.status) {
                case 0:
                    status = "en préparation";
                    break;
                case 1:
                    status = "préparée, vous pouvez venir la chercher";
                    break;
                case 2:
                    status = "livrée";
                    break;
                default:
                    console.log(`Sorry, we are out of ${order.status}.`);
            }
            console.log("status commande =>", status);
            console.log("order.status", order.status);
            message.contents.en = `Votre commande est ${status} !`
            message.include_external_user_ids.push(userId.toString());

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