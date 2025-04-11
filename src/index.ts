import express, { Application, Request, Response, NextFunction } from "express";
import { IPurchase } from "./interfaces/data.interface";
import { readData } from "./utils/read.data.json";
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

//Search any purchase
app.get('/purchase-orders/search', (req: Request, res: Response) => {
  const query = (req.query.query as string)?.toLowerCase() || '';

  const filteredOrders = readData().purchaseOrders.filter((order: any) =>
    order.itemName.toLowerCase().includes(query) ||
    order.supplier.toLowerCase().includes(query)
  );

  res.status(200).json({
    success: true,
    message: "Search order success",
    data: filteredOrders,
  });
});

// Read a Purchase Order by ID
app.get("/purchase-orders/:id", (req: Request, res: Response) => {
  try {
    const orderList = readData().purchaseOrders;

    const { id } = req.params;
    const purchaseOrder = orderList.find(
      (order: any) => order.id === parseInt(id)
    );

    if (!purchaseOrder) throw new Error("Purchase order not found");

    res.status(200).json({
      message: "Get purchase order successfully",
      data: purchaseOrder,
    });
  } catch (err: any) {
    res.status(500).json({
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

// Create Purchase
app.post("/purchase-orders", (req: Request, res: Response) => {
  const { itemName, category, quantity, supplier, status } = req.body;
  const data = readData();

  data.purchaseOrders.push({
    id: data.purchaseOrders[data.purchaseOrders.length - 1].id + 1,
    itemName,
    category,
    quantity,
    supplier,
    status,
  });

  writeData(data);

  res.status(201).json({
    success: true,
    message: "create order success",
    data: { itemName, category, quantity, supplier, status },
  });
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
