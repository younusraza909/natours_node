const app = require("./app");
const dotenv = require("dotenv");

// Setting Env Files
dotenv.config({ path: "./config.env" });

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
