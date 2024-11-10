const { Created, SuccessResponse, Ok } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    console.log("data is here ", req.body.refreshToken);
    const result = await AccessService.handleRefreshToken(
      req.body.refreshToken
    );
    new SuccessResponse({
      metaData: result,
    }).send(res);
  };
  login = async (req, res, next) => {
    console.log("data is here ", req.body);
    const result = await AccessService.login(req.body);
    new SuccessResponse({
      metaData: result,
    }).send(res);
  };
  signUp = async (req, res, next) => {
    const result = await AccessService.signUp(req.body);
    new Created({
      message: "Registered OK!",
      metaData: result,
    }).send(res);
  };
  logout = async (req, res, next) => {
    console.log("logout req.body ", req.keyStore);
    const result = await AccessService.logout(req.keyStore);

    new Ok({
      message: "Logout successfully!",
      metaData: result,
    }).send(res);
  };
}
module.exports = new AccessController();
