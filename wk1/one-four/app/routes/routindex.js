// const express = require("express");
// const router = express.Router();

// // localhost:3000/api
// router.get("/", (req, res) => {
//     res.status(200).json({
//         message: "GET to api" ,
//         metadata:{
//           hostname: req.hostname,
//           method: req.method,
//         },
//     });
// });

// router.get("/:bob", (req, res) => {
//   const {bob} = req.params;
//   res.status(200).json({
//     message: `GET to api with parameter ${bob}`,
//     metadata:{
//       hostname: req.hostname,
//       method: req.method,
//       parameter: bob
//     }
//   });
// });

// router.delete("/", (req, res) => {
//     res.status(200).json({
//         message: "DELETE to api" ,
//         metadata:{
//           hostname: req.hostname,
//           method: req.method,
//         },
//     });
// });

// router.post("/", (req, res) => {
//     const {data} = req.body;
//     res.status(200).json({
//         message: "POST to api" ,
//         data,
//         metadata:{
//           hostname: req.hostname,
//           method: req.method,
//         },
//     });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

/**
 * In-memory storage
 * This resets every time you restart the server (that’s okay for this assignment).
 */
let items = [
  { id: 45, data: "First item" },
  { id: 89, data: "Second item" },
  { id: 9, data: "Third item" },
];

// GET - http://localhost:3000/api
router.get("/", (req, res) => {
  res.status(200).json({
    message: "GET all items",
    items,
    metadata: {
      hostname: req.hostname,
      method: req.method,
      count: items.length,
    },
  });
});

// GET by ID - http://localhost:3000/api/45
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const found = items.find((item) => item.id === id);

  if (!found) {
    return res.status(404).json({
      message: `Item with id ${id} not found`,
      metadata: {
        hostname: req.hostname,
        method: req.method,
        id,
      },
    });
  }

  res.status(200).json({
    message: `GET item by id ${id}`,
    item: found,
    metadata: {
      hostname: req.hostname,
      method: req.method,
      id,
    },
  });
});

// POST - http://localhost:3000/api
router.post("/", (req, res) => {
  const { data } = req.body;

  // basic validation
  if (!data) {
    return res.status(400).json({
      message: "Missing 'data' in request body",
      metadata: { hostname: req.hostname, method: req.method },
    });
  }

  // simple id generation
  const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;

  const newItem = { id: newId, data };
  items.push(newItem);

  res.status(201).json({
    message: "POST created new item",
    item: newItem,
    metadata: {
      hostname: req.hostname,
      method: req.method,
    },
  });
});

// PUT by ID - http://localhost:3000/api/89
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({
      message: "Missing 'data' in request body",
      metadata: { hostname: req.hostname, method: req.method, id },
    });
  }

  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: `Item with id ${id} not found`,
      metadata: { hostname: req.hostname, method: req.method, id },
    });
  }

  items[index].data = data;

  res.status(200).json({
    message: `PUT updated item with id ${id}`,
    item: items[index],
    metadata: { hostname: req.hostname, method: req.method, id },
  });
});

// DELETE by ID - http://localhost:3000/api/9
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: `Item with id ${id} not found`,
      metadata: { hostname: req.hostname, method: req.method, id },
    });
  }

  const deleted = items.splice(index, 1);

  res.status(200).json({
    message: `DELETE removed item with id ${id}`,
    deleted: deleted[0],
    metadata: { hostname: req.hostname, method: req.method, id },
  });
});

module.exports = router;
