import { transformFileSync } from "@babel/core";
import BinaryPlugin from "./binary_plugin";
import { writeFileSync } from "fs";
import glob from "glob";

const patterns = ["**/binary.js"];

patterns.forEach((pattern) => {
    glob(pattern, (err, files) => {
        if (err) {
            console.log(err);
            throw new Error("Failed to get file names");
        }
        console.log(files);

        files.forEach((file) => {
            const { code } = transformFileSync(file, {
                configFile: false,
                parserOpts: {
                    sourceType: "module",
                },
                generatorOpts: {
                    retainLines: true,
                },
                plugins: [BinaryPlugin],
            });
            writeFileSync(file, code);
        })
    })
});
