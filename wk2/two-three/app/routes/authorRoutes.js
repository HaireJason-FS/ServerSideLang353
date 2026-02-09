const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({ 
    success: true ,
    message: `${req.method} - Request made to Author endpoint`, 
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ 
    id,
    success: true ,
    message: `${req.method} - Request made to author endpoint`, 
  });
});

router.post("/", (req, res) => {
  res.status(200).json({ 
    success: true ,
    message: `${req.method} - Request made to author endpoint`, 
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ 
    id,
    success: true ,
    message: `${req.method} - Request made to author endpoint`, 
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ 
    id,
    success: true ,
    message: `${req.method} - Request made to author endpoint`, 
  });
});


module.exports = router;