import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import * as express from "express";
import Route from "./route/route";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port: number =
      process.env.port != null ? parseInt(process.env.port) : 3000;

    app.use(express.json());
    app.use("/api/v1", Route);
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
