import { Router } from "express";
import { Op } from "sequelize";

import { Tag, SME } from "../models";

export const smeRouterFactory = () =>
  Router()
    .get("/sme", (req, res, next) => {
      SME.findAll({ include: [Tag] })
        .then((sme) => res.json(sme))
        .catch(next);
    })

    .get("/sme/:userId", (req, res, next) =>
      SME.findByPk(req.params.userId, { include: [{ model: Tag, as: "tags" }] })
        .then((sme) => (sme ? res.json(sme) : next({ statusCode: 404 })))
        .catch(next)
    )

    .post("/sme", (req, res, next) =>
      SME.create(req.body, {
        include: [{ model: Tag, as: "tags" }],
      })
        .then((sme) => res.json(sme))
        .catch(next)
    );
export const tagRouterFactory = () =>
  Router()
    .get("/tag", (req, res, next) =>
      Tag.findAll()
        .then((tag) => res.json(tag))
        .catch(next)
    )

    .get("/tag/:id", (req, res, next) =>
      SME.findAll({
        where: {
          "$tags.name$": { [Op.eq]: req.params.id },
        },
        include: {
          model: Tag,
          required: true,
          attributes: []
        },
      })
        .then((tag) => res.json(tag))
        .catch(next)
    )

    .post("/tag", (req, res, next) =>
      Tag.create(req.body)
        .then((tag) => res.json(tag))
        .catch(next)
    );
