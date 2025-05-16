const { Router } = require("express")


const controller = require("../controllers/account-controller")
const validator = require('../middlewares/validator')

const accountRouter = Router()

// prefix account/
accountRouter.get("info", controller.getInfo)
accountRouter.post("delete", controller.postDeleteAccount)
accountRouter.post("info/update", validator.updateInfo, controller.postInfoUpdate)
accountRouter.post("password/update", validator.updatePassword, controller.postInfoUpdate)
// accountRouter.post("password/recover", )


module.exports = moviesRouter