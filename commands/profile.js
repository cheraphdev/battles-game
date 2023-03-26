const userSchema = require("../models/userSchema");
const { AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

module.exports = {
  data: {
    description: "View your profile.",
    descriptionLocalizations: {
      fr: "Afficher votre profile."
    }
  },

  async exe(client, interaction) {
    const profiles = await userSchema.findOne({
      UserId: interaction.user.id
    });

    await interaction.deferReply();

    const buffer = await profileImage(interaction.user.id, {
      customTag: `${profiles.Flowers} fleur(s).`,
      customBadges: [profiles.Heart4, profiles.Heart3, profiles.Heart2, profiles.Heart1],
      overwriteBadges: true,
      usernameColor: '#d9dfef',
      //borderColor: ['#f90257', '#043a92'],
      squareAvatar: true
    });

    interaction.followUp({
      fr: {
        embeds: [{
          title: `Voici ta guêpe !`,
          description: `Trouve les messages cachés avec la réaction 🌼 et clique dessus pour gagner des fleurs !\n\n**Tu peux ensuite utiliser les fleurs pour :**\n🐝 Soigner ta guêpe avec le bouton ci-dessous !\n🐝 Tant que tu es en vie, tu peux attaquer les autres guêpes avec \`/fight\` !`,
          image: {
            url: "attachment://profile.png"
          },
          color: 0xFFFF00
        }],
        files: [new AttachmentBuilder(buffer, { name: 'profile.png' })],
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
      files: [new AttachmentBuilder(buffer, { name: 'profile.png' })],
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