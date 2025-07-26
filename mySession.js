var mySession = {};

exports.setMySession = (username) => { mySession.userName = username; console.log("Session Created."); };

exports.getMySession = () => mySession;

exports.deleteSession = () => { mySession = {}; console.log("Session Deleted."); };