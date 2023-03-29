const userSchema = require("../models/userSchema");
const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = {
  data: {
    description: "View a profile.",
    descriptionLocalizations: {
      fr: "Afficher un profile."
    }
  },

  async exe(client, interaction) {
    const userId = interaction.user.id;

    const user = await userSchema.findOne({ UserId: userId });

    const background = await Canvas.loadImage("./_assets/profile_card.png");
    const { body } = await request(interaction.user.displayAvatarURL({ format: 'jpg' }));
    const avatar = await Canvas.loadImage(await body.arrayBuffer());

    const canvas = Canvas.createCanvas(background.width, background.height);
    const context = canvas.getContext('2d');

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.save();
    context.beginPath();
    context.arc(150, 150, 70, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.drawImage(avatar, 80, 80, 140, 140);
    context.restore();

    context.fillStyle = '#ffff00';
    context.font = 'bold 32px sans-serif';
    context.fillText(`${user.Flowers}`, 457, 308);
    context.fillText(`${user.TotalHeart}`, 457, 353);

    interaction.reply({
      fr: {
        embeds: [{
          title: `Voici ta guêpe !`,
          description: `Trouve les messages cachés avec la réaction 🌼 et clique dessus pour gagner des fleurs !\n\n**Tu peux ensuite utiliser les fleurs pour :**\n🐝 Soigner ta guêpe avec le bouton ci-dessous !\n🐝 Tant que tu es en vie, tu peux attaquer les autres guêpes avec \`/fight\` !`,
          image: {
            url: "attachment://profile.png"
          },
          color: 0xFFFF00
        }],
        files: [new AttachmentBuilder(await canvas.encode('png'), { name: 'profile.png' })],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Option Supplémentaire",
                custom_id: `option`,
                style: 2
              },
              {
                type: 2,
                label: "Statistiques",
                custom_id: `statistics`,
                style: 1
              }
            ]
          }
        ]
      }
    }[interaction.locale] || {
      embeds: [{
        title: `Here is your wasp!`,
        description: `Find the hidden messages with the reaction 🌼 and click on them to win flowers!\n\n**You can then use the flowers to:**\n🐝 Treat a wasp with the button below!\n🐝 As long as you are alive, you can attack other wasps with \`/fight\`!`,
        image: {
          url: "attachment://profile.png"
        },
        color: 0xFFFF00
      }],
      files: [new AttachmentBuilder(await canvas.encode('png'), { name: 'profile.png' })],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Additional Option",
              custom_id: `option`,
              style: 2
            },
            {
              type: 2,
              label: "Statistics",
              custom_id: `statistics`,
              style: 1
            }
          ]
        }
      ]
    }
    )
  }
}