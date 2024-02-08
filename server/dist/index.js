"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const connection_js_1 = require("./db/connection.js");
const PORT = process.env.PORT || 4657;
// app
(0, connection_js_1.connectDB)()
    .then((res) => {
    app_js_1.httpServer.listen(PORT, async () => {
        console.log(res);
        console.log("Server is running on port", PORT, "🚀 with express.js and socket.io");
    });
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map