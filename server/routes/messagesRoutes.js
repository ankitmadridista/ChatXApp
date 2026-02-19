const { getAllMessages, addMessage } = require("../controllers/messagesController");

const router = require("express").Router();
router.post("/getallmsg", getAllMessages);
router.post("/addmsg", addMessage);

module.exports = router;