db = db.getSiblingDB('admin');

db.createUser({
  user: "ssluser",
  pwd: "sslpass",
  roles: [ { role: "readWriteAnyDatabase", db: "admin" } ]
});
