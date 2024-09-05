
const app = require("./app");
const connectDB = require("./config/db.js");
const { serverPort } = require("./secret.js");

app.listen(serverPort, async () => {
  console.log(`App runing on port ${serverPort}`);

  await connectDB();
});
