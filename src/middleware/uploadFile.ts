import { NextFunction, Request, Response } from "express";
import * as multer from "multer";
export default new (class uploadFile {
  // prepara for create a nwe buffer file to upload
  uploadImage(fieldname: string) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "src/upload");
      },
      filename: function (req, file, cb) {
        const unixSuffix = Date.now();
        cb(null, `${file.fieldname}-${unixSuffix}.png`);
      },
    });

    const uploadFile = multer({ storage });

    return (req: Request, res: Response, next: NextFunction) => {
      uploadFile.single(fieldname)(req, res, (error: any) => {
        if (error) return res.status(500).json(error);

        if (req.file) {
          res.locals.filename = req.file.filename;
        }

        next();
      });
    };
  }

  // save to local storage
})();
