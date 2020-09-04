require("dotenv").config();

module.exports = {
    env:{
        MEETING_SERVICE_URL = process.env.MEETING_SERVICE_URL,
        GAME_ASSETS_URL = process.env.GAME_ASSETS_URL
    }
}