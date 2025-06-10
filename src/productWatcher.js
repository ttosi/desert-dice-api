const db = require("./database/database");
const { differenceInMinutes } = require("date-fns");

const checkReservedExpiration = async () => {
  const rows = await db.fetchAll(
    `SELECT id, reserved_at
     FROM product
     WHERE reserved_at IS NOT NULL`
  );

  const minSinceRes = differenceInMinutes(
    new Date(),
    `${rows[0].reserved_at}Z` // so date-fns won't convert to local
  );
  console.log(minSinceRes);
};

const watcher = {
  timer: undefined,
  start(interval) {
    this.timer = setInterval(() => {
      checkReservedExpiration();
    }, interval);
  },
};

module.exports = { watcher };
