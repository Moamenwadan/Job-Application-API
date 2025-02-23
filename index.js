import express from "express";
import boot from "./src/app.controller.js";
const app = express();
await boot(app, express);
const port = 3000;
app.listen(port, () => {
  console.log(`the server is run on port ${port} `);
});
