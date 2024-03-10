const { setCookie } = require('../../libs/setCookie')
const adminModel = require('../../model/admin/adminAuthModel')


const create = (req, res) => {
  adminModel.create(req.body)
    .then((data) => res.status(201).json(data[0]))
    .catch((err) => res.status(400).send(err))
} 

const update = (req, res) => {
  adminModel.update(req.body, req.params.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err))
}

const read = (req, res) => {
  adminModel.read()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err))
}

const findById = (req, res) => {
  adminModel.findById(req.params.id)
    .then((data) => res.status(200).json(data[0]))
    .catch((err) => res.status(400).send(err))
}

const remove = (req, res) => {
  adminModel.remove(req.params.id)
    .then(() => res.status(200).send("admin removed"))
    .catch((err) => res.status(400).send(err))
}

const login = (req, res) => {
  adminModel.login(req.body)
    .then((token) =>{
      setCookie(res, "admin_roommakeover", token);
      return res.status(200).json({ token })
    })
    .catch(err => res.status(400).send(err))
}

module.exports = { create, update, read, findById, remove, login }
