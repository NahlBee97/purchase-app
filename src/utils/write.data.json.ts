import fs from "fs";

export function writeData(dataToWrite: any) {
    fs.writeFileSync("./src/db/db.json", JSON.stringify(dataToWrite));
}