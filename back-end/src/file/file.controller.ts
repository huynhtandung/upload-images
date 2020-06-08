import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Res,
  HttpStatus,
  UseGuards,
  UploadedFiles,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { globalConstants } from "src/constant";
const FileType = require("file-type");
const fs = require("fs");

@Controller("file")
export class FileController {
  @Get("download")
  async getFile(@Query("id") id: string, @Res() res) {
    if (id.match(/(\.|\/)/)) {
      res.status(HttpStatus.BAD_REQUEST).send();
    } else {
      res.sendFile(id, { root: "tmp" });
    }
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      dest: "tmp",
      limits: { fileSize: globalConstants.MAX_SIZE_FILE },
    })
  )
  async uploadFile(@UploadedFile() file, @Res() res) {
    if (!file) {
      res.status(HttpStatus.BAD_REQUEST).send("No File Upload");
    } else {
      const fileType = await FileType.fromFile(`tmp/${file.filename}`);
      if (fileType === undefined || (fileType && fileType.ext !== "png")) {
        fs.unlink(`tmp/${file.filename}`, (err) => {
          if (err) {
            console.log("Error when delete file");
            throw err;
          }
          console.log(`Successfully deleted /tmp/${file.filename}`);
        });
        res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).send();
      } else {
        const responseData = {
          id: file.filename,
          originalname: file.originalname,
          size: file.size,
        };
        console.log("Response data when upload: ", responseData);
        res.status(HttpStatus.CREATED).send(responseData);
      }
    }
  }
  @Post("uploads")
  @UseInterceptors(FilesInterceptor("files"))
  async uploadFiles(@UploadedFiles() files, @Res() res) {
    files.forEach((file: any) => {
      console.log(file);
      fs.writeFile(
        `tmp/${Math.round(Math.random() * 100000)}`,
        file.buffer,
        (err) => {}
      );
    });
    /*files.forEach((file) => {
      console.log(file);
      fs.writeFile(
        `tmp/${Math.round(Math.random() * 10000000)}`,
        file,
        function(err) {
          if (err) return console.log(err);
        }
      );
    });*/
    res.json("OK");
  }
}
