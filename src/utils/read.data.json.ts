import fs from "fs";

export function readData() {
    const readData = fs.readFileSync("./src/db/db.json", "utf-8");
    const readDataJSON = JSON.parse(readData); 

    return readDataJSON;
}