// controller file where the logic lives

// models import
const Library = require("../models/libraries");
// import flash for alert messages
const flashMessage = require("../utils/flashMessage");
// cloudinary import for deleting img
const { cloudinary } = require("../cloudinary");
// mapboxSdk for geocoding
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async function (req, res) {
  const result = await Library.find({});
  res.render("libraries/index", { result, req });
};

module.exports.newForm = function (req, res) {
  res.render("libraries/new", { req });
};

module.exports.details = async function (req, res) {
  const { id } = req.params; //destructure req.params to get id
  const result = await Library.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        model: "User",
      },
    })
    .populate("owner");
  // if (!result) { // does not work, mongo error id invalid
  //   flashMessage(req, "error", "no libraries found matching that id");
  //   return res.redirect("libraries");
  // }
  // console.log(result.reviews);
  // console.log(result);
  res.render("libraries/details", { result, req });
};

module.exports.editForm = async function (req, res) {
  const { id } = req.params;
  const result = await Library.findById(id);
  res.render("libraries/edit", { result, req });
};

module.exports.newLibrary = async function (req, res) {
  const geoData = await geocoder // make a mapbox query
    .forwardGeocode({
      query: req.body.lib.location,
      limit: 1,
    })
    .send();
  // console.log(geoData.body.features[0].geometry.coordinates);

  const lib = new Library(req.body.lib);
  lib.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  })); // associate multer data into lib object
  lib.owner = req.user._id; // assigns the current logged in user as the owner of the new lib
  lib.geometry = geoData.body.features[0].geometry;
  await lib.save();
  // console.log(lib);
  flashMessage(req, "success", "successfully created new library");
  res.redirect(`/libraries/${lib._id}`);
};

module.exports.updateLibrary = async function (req, res) {
  const { id } = req.params;
  const geoData = await geocoder // make a mapbox query of new location
    .forwardGeocode({
      query: req.body.lib.location,
      limit: 1,
    })
    .send();
  const lib = await Library.findByIdAndUpdate(id, { ...req.body.lib }); //spread operator pass all elements of iterable lib
  lib.owner = req.user._id;
  lib.geometry = geoData.body.features[0].geometry;
  const imgArray = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  })); // associate multer data into lib object
  lib.images.push(...imgArray);
  await lib.save();
  // remove image id from lib if there is one selected
  if (req.body.delImg) {
    for (let file of req.body.delImg) {
      // console.log(file); // returns filepath?
      await cloudinary.uploader.destroy(file); // apparently the filepath is also the public ID needed for cloudinary
    }
    await lib.updateOne({
      $pull: { images: { filename: { $in: req.body.delImg } } },
    });
  }
  flashMessage(req, "success", "successfully updated library");
  res.redirect(`/libraries/${id}`);
};

module.exports.deleteLibrary = async function (req, res) {
  const { id } = req.params;
  const lib = await Library.findById(id);
  const imgArray = lib.images.map((img) => img.filename);
  // console.log(imgArray);
  imgArray.forEach(async (img) => await cloudinary.uploader.destroy(img));
  await Library.findByIdAndDelete(id);
  flashMessage(req, "success", "successfully deleted library");
  res.redirect("/libraries");
};
