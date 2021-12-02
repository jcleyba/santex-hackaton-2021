import { Router } from 'express'
import { Op } from 'sequelize'

import { Tag, SME } from '../models'
import { messageToTagArray } from '../utils/parse-message'

export const smeRouterFactory = () =>
  Router()
    .get('/sme', (req, res, next) => {
      SME.findAll({ include: [Tag] })
        .then((sme) => res.json(sme))
        .catch(next)
    })

    .get('/sme/:userId', (req, res, next) =>
      SME.findByPk(req.params.userId, {})
        .then((sme) => (sme ? res.json(sme) : next({ statusCode: 404 })))
        .catch(next)
    )

    .post('/sme', async (req, res) => {
      const body = req.body
      const sme = { userId: body.user_id, tags: messageToTagArray(body.text) }

      try {
        const [newSme] = await SME.upsert(sme)

        sme.tags.forEach(async (tag) => {
          const [newTag] = await Tag.upsert(tag)
          newTag.$add('smes', newSme)
        })

        res.json(
          `Gracias por suscribirse a ${sme.tags.map(({ name }) => name)}`
        )
      } catch (e) {
        console.debug('Error: ', e)
      }
    })

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

    .get('/tags/:tags', (req, res, next) => {
      const tags = req.params.tags.split(',')
      SME.findAll({
        where: {
          '$tags.name$': { [Op.in]: tags },
        },
        include: {
          model: Tag,
          required: true,
          attributes: [],
        },
      })
        .then((tag) => res.json(tag))
        .catch(next)
    })

    .post('/tag', (req, res, next) =>
      Tag.create(req.body)
        .then((tag) => res.json(tag))
        .catch(next)
    )
