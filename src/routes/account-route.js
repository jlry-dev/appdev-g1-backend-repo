const { Router } = require("express")

const verifyToken = require('../middlewares/jwt-verifier-middleware')
const controller = require("../controllers/account-controller")
const validator = require('../middlewares/validator')

const accountRouter = Router()

accountRouter.use(verifyToken)

// prefix account/
accountRouter.get("/info", controller.getInfo)
accountRouter.post("/delete", controller.postDeleteAccount)
accountRouter.post("/info/update", validator.updateInfo, controller.postInfoUpdate)
accountRouter.post("/password/update", validator.updatePassword, controller.postNewPassword)
// accountRouter.post("password/recover", )


module.exports = accountRouter