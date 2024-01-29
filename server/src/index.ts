import { httpServer } from "./app.js";
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
