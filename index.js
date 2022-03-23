import { globby } from "globby";
import sharp from "sharp";
import fs from "fs";

const input = "./input";
const output = "./output";
const extensionOutput = ".webp";

const getFiles = async () => {
    const paths = await globby(input, {
        expandDirectories: {
            extensions: ["jpg", "jpeg", "png"],
        },
    });
    return paths;
};

const sharpImages = async (files) => {
    for (let i = 0; i < files.length; i++) {
        const item = files[i].split("/");
        const image = item.pop();
        const removeImageExt = image.split(".");
        item.shift();
        const dir = item.join("/");

        if (!fs.existsSync(`${output}/${dir}`)) {
            fs.mkdirSync(`${output}/${dir}`, { recursive: true });
        }

        await sharp(files[i])
            .jpeg({ quality: 50, mozjpeg: true, progressive: true, force: false })
            .png({ quality: 50, compressionLevel: 1, progressive: true, force: false })
            .webp({ quality: 50, lossless: true, progressive: true, force: false })
            .resize(1920, 1920, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
              })

            // keep extension
            .toFile(`${output}/${dir}/${image}`);

            // change extension
            // .toFile(`${output}/${dir}/${removeImageExt[0]}${extensionOutput}`);
    }
};

getFiles()
    .then((files) => {
        return sharpImages(files);
    })
    .catch((e) => {
        throw e;
    });
