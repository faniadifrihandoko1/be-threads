import { error } from "console";
import * as fs from "fs";
import * as path from "path";
export default function deleteTempFiles() {
  const directory = "src/upload";

  fs.readdir(directory, (error, files) => {
    if (error) {
      console.log(error);
    }

    for (const file of files) {
      fs.unlink(path.join(directory, file), (error) => {
        console.log(error);
      });
    }
  });
}
