import { AppDataSource } from "./data-source";
import * as express from "express";
import Route from "./route/route";
import * as cors from "cors";
import "dotenv/config";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port: number =
      process.env.port != null ? parseInt(process.env.port) : 3000;
    app.use(
      cors({
        origin: "http://localhost:5173",
        method: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowHeaders: ["Content-Type", "Authorization"],
      })
    );
    app.use(express.json());
    app.use("/api/v1", Route);
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
