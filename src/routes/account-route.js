const { Router } = require("express")

const verifyToken = require('../middlewares/jwt-verifier-middleware')
const controller = require("../controllers/account-controller")
const validator = require('../middlewares/validator')

const accountRouter = Router()


accountRouter.post("/password/reset", validator.resetPassword, controller.postPasswordReset)
accountRouter.post("/password/reset/request", validator.validateEmail, controller.postRequestReset)
accountRouter.post("/password/reset/confirm", validator.validateEmail, controller.postConfirmReset)

accountRouter.use(verifyToken)
// prefix account/
accountRouter.post("/password/update", validator.updatePassword, controller.postNewPassword)
accountRouter.get("/info", controller.getInfo)
accountRouter.post("/delete", controller.postDeleteAccount)
accountRouter.post("/info/update", validator.updateInfo, controller.postInfoUpdate)




module.exports = accountRouter
