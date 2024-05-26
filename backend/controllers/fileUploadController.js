const formidable = require("formidable");
const fileUpload = require("../models/fileUpload");

exports.sendFile = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).send("Internal Server Error");
    }

    const { cid, formData, isCert } = fields;
    const userId = req.user.displayName ? req.user.id : req.user._id;
    const isCertificate = isCert || false;

    const uploadedFile = new fileUpload({
      user: userId,
      originalfileName: files.file.originalFilename,
      newfileName: files.file.newFilename,
      Cert: isCertificate,
      cid: cid,
    });

    try {
      const existingFile = await fileUpload.findOne({ user: userId, cid: cid });
      if (!existingFile) {
        await uploadedFile.save();
      }
      res.redirect("/file/getAllFiles");
    } catch (error) {
      console.error("Error saving file:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

exports.getAllFiles = (req, res) => {
  res.json({
    redirectUrl:
      "https://blockation-ffth20iat-adityakumar41s-projects.vercel.app//file/getAllFiles",
  });
};
