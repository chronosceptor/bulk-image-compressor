import { globby } from "globby";
import sharp from "sharp";
import fs from "fs";

// select input folder
const input = "./input";

// select output folder
const output = "./output";

// select file  extension output
const extensionOutput = ".jpg";

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
            // more output options: https://sharp.pixelplumbing.com/api-output
            .jpeg({
                progressive: true,
                quality: 75,
                mozjpeg: true,
                force: false,
            })
            .png({
                progressive: true,
                quality: 75,
                compressionLevel: 9,
                force: false,
            })
            .webp({
                quality: 75,
                lossless: false,
                force: false,
            })
            .resize(1920, 1920, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            })

            // keep extension
            // .toFile(`${output}/${dir}/${image}`);

            // change extension
            .toFile(`${output}/${dir}/${removeImageExt[0]}${extensionOutput}`);
    }
};

getFiles()
    .then((files) => {
        return sharpImages(files);
    })
    .catch((e) => {
        throw e;
    });
