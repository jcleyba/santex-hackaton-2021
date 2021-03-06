import { Router } from 'express';
import { Op } from 'sequelize';

import { Tag, SME } from '../models';
import { createSlackConversation } from '../utils/create-conversation';
import { createMessage } from '../utils/create-message';
import { inviteToSlackConversation } from '../utils/invite-conversation';
import { messageToTagArray } from '../utils/parse-message';

export const smeRouterFactory = () =>
  Router()
    .get('/sme', (req, res, next) => {
      SME.findAll({ include: [Tag] })
        .then((sme) => res.json(sme))
        .catch(next);
    })

    .get('/sme/:userId', (req, res, next) =>
      SME.findByPk(req.params.userId, {})
        .then((sme) => (sme ? res.json(sme) : next({ statusCode: 404 })))
        .catch(next)
    )

    .post('/sme', async (req, res) => {
      const body = req.body;
      const tags = messageToTagArray(body.text);
      const sme = { userId: body.user_id, tags };

      try {
        const [newSme] = await SME.upsert(sme);

        tags.forEach(async (tag) => {
          const [newTag] = await Tag.upsert(tag);
          newTag.$add('smes', newSme);
        });

        res.json({
          response_type: 'in_channel',
          text: `Gracias <@${sme.userId}|user> por suscribirse a ${tags
            .map(({ name }) => name)
            .join(', ')}`,
        });
      } catch (e) {
        console.error('Error: ', e);
        res.end(400);
      }
    })

    .post('/unregister', async (req, res) => {
      const body = req.body;
      const userId = body.user_id;
      const tags = messageToTagArray(body.text);

      try {
        const sme = await SME.findOne({ where: { userId }, include: [Tag] });

        sme &&
          tags.forEach(async (tag) => {
            const foundTag = sme.tags.find(({ name }) => tag.name === name);
            if (foundTag) {
              sme.$remove('tags', foundTag);
            }
          });

        res.json({
          response_type: 'in_channel',
          text: `<@${userId}|user> ya no estás subscripto a ${tags
            .map(({ name }) => name)
            .join(', ')}`,
        });
        res.json();
      } catch (e) {
        console.error('Error: ', e);
      }
    });

export const tagRouterFactory = () =>
  Router()
    .get('/tag', (req, res, next) =>
      Tag.findAll()
        .then((tag) => res.json(tag))
        .catch(next)
    )

    .get('/tag/:id', (req, res, next) =>
      SME.findAll({
        where: {
          '$tags.name$': { [Op.eq]: req.params.id },
        },
        include: {
          model: Tag,
          required: true,
          attributes: [],
        },
      })
        .then((tag) => res.json(tag))
        .catch(next)
    )

    .post('/help', async (req, res) => {
      const userName = req.body.user_name;
      const userId = req.body.user_id;
      const text = req.body.text;
      const tags = messageToTagArray(text).map(({ name }) => name);

      try {
        const smes = await SME.findAll({
          where: {
            '$tags.name$': { [Op.in]: tags },
          },
          include: {
            model: Tag,
            required: true,
            attributes: [],
          },
        });
        const smeIds = new Set(smes.map(({ userId }) => userId));
        smeIds.add(userId);
        const conversationName = `${userName
          .replace(/[^\w\s]/gi, '')
          .toLocaleLowerCase()}-${Date.now()}`;

        const createConvo = await createSlackConversation(conversationName);

        if (!createConvo?.channel) {
          console.error('Conversation cannot be created');
          res.end(400);
          return;
        }
        const channelId = createConvo.channel.id;

        inviteToSlackConversation(channelId, Array.from(smeIds));
        createMessage(channelId, text);

        res.json({
          response_type: 'in_channel',
          text: `Mensaje creado en grupo <#${channelId}|${conversationName}> para usuarios ${Array.from(
            smeIds
          )
            .map((id) => `<@${id}|user>`)
            .join(', ')}`,
        });
      } catch (e) {
        console.error('Error: ', e);
      }
    })

    .post('/tag', (req, res, next) =>
      Tag.create(req.body)
        .then((tag) => res.json(tag))
        .catch(next)
    );
