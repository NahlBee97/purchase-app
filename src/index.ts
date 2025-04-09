import express, { Application, Request, Response, NextFunction } from "express";
import { readData } from "./utils/read.data.json";
import { IPurchase } from "./interfaces/data.interface";
import { writeData } from "./utils/write.data.json";

const port = 8000;

const app: Application = express();

// MIDDLEWARE
app.use(express.json());

// get all purchase data
app.get("/purchase-orders", (req: Request, res: Response) => {
  try {
    const data = readData();
    const orderList = data.purchaseOrders;

    res.status(200).json({
      message: "Get purchase orders successfully",
      data: orderList,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
      data: {},
    });
  }
});

// update purchase data by id
app.put("/purchase-orders/:id", (req: Request, res: Response) => {
  try {
    const purchaseId = parseInt(req.params.id);
    const { itemName, category, quantity, supplier, status } = req.body;

    const data = readData();
    const purchases = data.purchaseOrders;
    const purchaseIndex = purchases.findIndex(
      (purchase: IPurchase) => purchase.id === purchaseId
    );

    const purchase = purchases[purchaseIndex];

    const modifiedPurchase = {
      id: purchaseId,
      itemName: itemName || purchase.id,
      category: category || purchase.category,
      quantity: quantity || purchase.quantity,
      supplier: supplier || purchase.supplier,
      status: status || purchase.status,
    };

    purchases[purchaseIndex] = modifiedPurchase;

    writeData(data);

    res.status(200).json({
      message: `edit purchase data by id ${purchaseId} success`,
      data: modifiedPurchase,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
      data: {},
    });
  }
});

// delete purchase
app.delete("/purchase-orders/:id", (req: Request, res: Response) => {
  try {
    const purchaseId = parseInt(req.params.id);

    const data = readData();

    const purchaseIndex = data.purchaseOrders.findIndex(
      (purchase: IPurchase) => purchase.id === purchaseId
    );

    data.purchaseOrders.splice(purchaseIndex, 1);

    writeData(data);

    res.status(200).json({
      message: `delete purchase data by id ${purchaseId} success`,
      data: data,
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
