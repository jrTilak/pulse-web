import { httpServer } from "./app.js";
// import { startAgenda } from "./controllers/agenda-event-controllers.js";
import { connectDB } from "./db/connection.js";

const PORT = process.env.PORT || 4657;

// app
connectDB()
  .then((res) => {
    httpServer.listen(PORT, async () => {
      console.log(res);
      console.log(
        "Server is running on port",
        PORT,
        "🚀 with express.js and socket.io"
      );
    });
  })
  .catch((err) => {
    console.log(err);
  })
  // .finally(async () => {
  //   console.log("Starting agenda.....");
  //   await startAgenda(process.env.MONGODB_CONNECTION_STRING);
  // });
