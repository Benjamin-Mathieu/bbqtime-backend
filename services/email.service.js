const crypto = require("crypto");
const moment = require("moment");
const models = require("../models");
const axios = require("axios");

const headers = {
  "Content-type": "application/json",
  "api-key": "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",
  accept: "application/json",
};
const service = {
  sendEmailVerification: async (user_id, email) => {
    try {
      const randomString = crypto.randomBytes(128).toString("hex");
      const url = `http://localhost:8080/account-verification/${user_id}/${randomString}`;
      const expiration = moment().add(10, "minutes");
      await service.sendEmail(
        email,
        "Vérifiez votre compte !",
        "<h1>Bienvenue chez Vosges and Food !</h1>" +
          "<div>Veuillez cliquer sur le lien ci-dessous pour vérifier votre compte:</div>" +
          '<div><a href="' +
          url +
          "\">Lien d'activation</a></div>"
      );
      return {
        hash: randomString,
        hashExpiration: expiration.toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
  sendEmailVerificationCode: async (user_id, email) => {
    const rInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const code = rInt(100000, 999999);
    const expiration = moment().add(10, "minutes").locale("fr");
    await service.sendEmail(
      email,
      "Bienvenue chez Vosges and Food !",
      "<h1>Bienvenue chez Vosges and Food !</h1>" +
        "<div>Veuillez entrer le code de vérification suivant dans l'application pour vérifier votre compte:</div>" +
        "<div><h2> " +
        code +
        "</h2></div>"
    );
    return {
      code,
      hashExpiration: expiration.toDate().toString(),
    };
  },
  sendEmailCommande: async (user, commande, restaurant_id) => {
    try {
      const restau = await models.restaurant.findOne({ where: { id: restaurant_id } });
      await service.sendEmail(
        restau.email,
        "Vous avez une nouvelle commande !",
        `<h1>Vous avez une nouvelle commande de ${user.prenom} ${user.nom}!</h1>
                    <div>Horaire souhaité: ${moment(commande.horaire).format("DD/MM/YYYY hh:mm")}</div>
                    <div>Type de commande: ${commande.type}</div>`
      );
    } catch (err) {
      throw err;
    }
  },
  sendEmailReservation: async (user, reservation, restaurant_id) => {
    try {
      const restau = await models.restaurant.findOne({ where: { id: restaurant_id } });
      await service.sendEmail(
        restau.email,
        "Vous avez une nouvelle réservation !",
        `<h1>Vous avez une nouvelle commande de ${user.prenom} ${user.nom}!</h1>
                    <div>Horaire souhaité: ${moment(reservation.date).format("DD/MM/YYYY hh:mm")}</div>`
      );
    } catch (err) {
      throw err;
    }
  },
  sendEmailResetPassword: async (user) => {
    try {
      const rInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      const code = rInt(100000, 999999);
      await service.sendEmail(
        user.email,
        "Demande de réinitialisation du mot de passe",
        `<h1>Demande de réinitialisation du mot de passe</h1>
                    <div>Veuillez entrer le code suivant dans l'application: ${code}</div>`
      );
      return code;
    } catch (err) {
      throw err;
    }
  },
  sendRegisterEmailToRestaurant: async (restaurant, pwd, stripeUrl) => {
    try {
      await service.sendEmail(
        restaurant.email,
        "Bienvenue chez Vosges and Food !",
        "<h1>Bienvenue chez Vosges and Food !</h1>" +
          '<div>Veuillez suivre les instructions fourni par notre prestataire de paiement Stripe via ce <div><a href="' +
          stripeUrl +
          '">lien.</a></div>' +
          "<div>Pour vous connecter à l'application veuillez utiliser votre email " +
          restaurant.email +
          " et ce mot de passe " +
          pwd +
          "</div>"
      );
    } catch (err) {
      throw err;
    }
  },
  async sendEmail(email, subject, htmlContent) {
    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: "Vosges and Food",
          email: "contact@vosges-and-food.fr",
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
};
module.exports = service;
