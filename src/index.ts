import express, { Application, Request, Response, NextFunction } from "express";
import { readData } from "./utils/read.data.json";

const port = 8000;

const app: Application = express();

// MIDDLEWARE
app.use(express.json());

app.get("/purchase-orders", (req: Request, res: Response) => {
    try {
        const data = readData();
        const orderList = data.purchaseOrders;

        res.status(200).json({
          message: "Get purchase orders successfully",
          data: orderList
        });
    } catch (err: any) {
        res.status(400).json({
          message: err.message,
          data: {},
        });
    }
});

// ERROR HANDLING MIDDLEWARE
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    error: true,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
