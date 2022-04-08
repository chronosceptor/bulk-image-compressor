import { globby } from "globby";
import sharp from "sharp";
import fs from "fs";

// config
const input = "./input";
const output = "./output";
const extensionOutput = ".webp";

// get files
const getFiles = async () => {
    const paths = await globby(input, {
        expandDirectories: {
            extensions: ["jpg", "jpeg", "png"],
        },
    });
    return paths;
};

// compres image
async function compressImage(file) {
    const item = file.split("/");
    const image = item.pop();
    const removeImageExt = image.split(".");
    item.shift();
    const dir = item.join("/");

    if (!fs.existsSync(`${output}/${dir}`)) {
        fs.mkdirSync(`${output}/${dir}`, { recursive: true });
    }

    // more output options: https://sharp.pixelplumbing.com/api-output
    await sharp(file)
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
        .rotate()
        .resize(1920, 1920, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
        })

        // keep extension
        // .toFile(`${output}/${dir}/${image}`);

        // use extensionOutput
        .toFile(`${output}/${dir}/${removeImageExt[0]}${extensionOutput}`);

    return `optimized: ${image}`;
}

// compress all images
const imageCompressor = async () => {
    const files = await getFiles();
    Promise.all(
        files.map(async (file) => {
            const file1 = await compressImage(file);
            console.log(`${file1} ✅`);
        })
    ).then(() => {
        console.log("complete 🏁");
    });
};
imageCompressor();
