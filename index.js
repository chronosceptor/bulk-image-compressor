import { globby } from "globby";
import sharp from "sharp";
import fs from "fs";

// select input folder
const input = "./input";

// select output folder
const output = "./output";

// select file  extension output
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
    files.forEach(async (file) => {
        const item = file.split("/");
        const image = item.pop();
        const removeImageExt = image.split(".");
        item.shift();
        const dir = item.join("/");

        if (!fs.existsSync(`${output}/${dir}`)) {
            fs.mkdirSync(`${output}/${dir}`, { recursive: true });
        }

        await sharp(file)
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
                colors: 256,
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
            console.log(file);
    });
};

getFiles()
    .then((files) => {
        return sharpImages(files);
    })
    .then(() => {
        return console.log("finish");
    })
    .catch((e) => {
        throw e;
    });
