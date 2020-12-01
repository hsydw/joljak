const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Postest1 = require("../models/postest");

const config = require("../config/database");

// Register 사용자등록
router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
  });

  User.getUserByUsername(newUser.username, (err, user) => {
    if (err) throw err;
    if (user) {
      return res.json({
        success: false,
        msg: "동일한 아이디가 존재합니다. 사용자 등록 실패.",
      });
    } else {
      User.addUser(newUser, (err, user) => {
        if (err) {
          res.json({ success: false, msg: "사용자 등록 실패" });
        } else {
          res.json({ success: true, msg: "사용자 등록 성공" });
        }
      });
    }
  });
});

// Authenticate 사용자인증, 로그인
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found! 등록된 사용자가 없습니다...",
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 604800, // 1 week, 유효기간: 1주일
        });

        res.json({
          success: true,
          token: "JWT " + token,
          userNoPW: {
            // id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            age: user.age,
          },
        });
      } else {
        return res.json({
          success: false,
          msg: "Wrong password. 패스워드가 틀립니다... ",
        });
      }
    });
  });
});

// profile 접근은 로그인 상태에서만 토큰을 이용하여 접근하도록 설정
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      user: {
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        age: req.user.age,
      },
    });
  }
);

router.get("/list", (req, res, next) => {
  User.getAll((err, users) => {
    if (err) throw err;
    res.json(users);
  });
});

router.post("/postest", (req, res, next) => {
  const parsedata = {
    uid: req.body.uid,
    mac: req.body.mac,
    hostname: req.body.hostname,
  };

  if (
    req.body.uid == undefined ||
    req.body.mac == undefined ||
    req.body.hostname == undefined
  ) {
    return res.json({ success: false, msg: "Fail" });
  }

  Postest1.getUser(
    parsedata.uid,
    parsedata.mac,
    parsedata.hostname,
    (err, user) => {
      if (!user) {
        console.log("matching fail");
        return res.json({ success: false, msg: "Compare Fail" });
      } else {
        console.log("matching success");
        return res.json({ success: true, msg: "등록된 사용자 입니다." });
      }
    }
  );
});

router.post("/uidadd", (req, res, next) => {
  const parsedata = {
    uid: req.body.uid,
    mac: req.body.mac,
    username: req.body.username,
    hostname: req.body.hostname,
  };

  Postest1.getUserByUid(parsedata.uid, (err, user) => {
    if (!user) {
      Postest1.add(parsedata);
      return res.json({
        success: true,
        msg: "신규 UID : " + parsedata.uid + " 등록 되었습니다.",
      });
    } else {
      return res.json({ success: false, msg: "이미 등록된 사용자입니다." });
    }
  });

  console.log(parsedata);
});

router.post("/uidrm", function (req, res) {
  Postest1.remove({ uid: req.body.uid }, function (err, output) {
    if (err)
      return res
        .status(500)
        .json({ success: false, error: "database failure" });
    res.json({ success: true, msg: "삭제 성공" });
  });
});

router.get("/testest", (req, res, next) => {
  Postest1.getAll((err, users) => {
    if (err) throw err;
    res.json(users);
  });
});

module.exports = router;
