const mongoose = require("mongoose");
const config = require("../config/database");

const PostSchema = mongoose.Schema({
  uid: {
    type: String,
  },
  mac: {
    type: String,
  },
  username: {
    type: String,
  },
  hostname: {
    type: String,
  },
});

const Postest1 = mongoose.model("Postest", PostSchema);

Postest1.add = function (parsedata, callback) {
  //Postest1.save(parsedata, callback);

  var postestGo = new Postest1({
    uid: parsedata.uid,
    mac: parsedata.mac,
    hostname: parsedata.hostname,
    username: parsedata.username,
  });

  // save model to database
  postestGo.save(function (callback) {
    if (callback) return console.log(callback);
    else console.log("saved success");
  });
};

Postest1.getAll = function (callback) {
  Postest1.find(callback);
};

Postest1.getUser = function (uid, mac, hostname, callback) {
  const query = { uid: uid, mac: mac, hostname: hostname };
  Postest1.findOne(query, callback);
};

Postest1.getUserByUid = function (uid, callback) {
  const query = { uid: uid };
  Postest1.findOne(query, callback);
};

Postest1.getUserByMac = function (mac, callback) {
  const query = { mac: mac };
  Postest1.findOne(query, callback);
};

Postest1.getUserByHostname = function (hostname, callback) {
  const query = { hostname: hostname };
  Postest1.findOne(query, callback);
};

Postest1.rmUser = function (user, callback) {
  console.log(user);
  User.findAndRemove(user, callback);
};

module.exports = Postest1;
