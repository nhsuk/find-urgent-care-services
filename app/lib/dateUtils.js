const moment = require('moment');
require('moment-timezone');

function getDayName(date) {
  return date.format('dddd').toLowerCase();
}

function now() {
  return global.now || moment();
}

function nowForDisplay() {
  return now().tz('Europe/London').format('dddd hh:mm');
}

function setNow(datetime) {
  global.now = datetime ? moment.tz(datetime, 'Europe/London') : datetime;
}

function getTime(date, hour, minute) {
  const returnDate = date.clone().tz('Europe/London');
  returnDate.set({
    hour,
    minute,
    second: 0,
    millisecond: 0,
  });

  return returnDate;
}

function getTimeFromString(timeString) {
  return {
    hours: parseInt(timeString.split(':')[0], 10),
    minutes: parseInt(timeString.split(':')[1], 10),
  };
}

function timeInRange(date, open, close) {
  const openTime = getTimeFromString(open);
  const closeTime = getTimeFromString(close);

  let start = getTime(date, openTime.hours, openTime.minutes);
  let end = getTime(date, closeTime.hours, closeTime.minutes);

  if (end < start) {
    if (date.isSameOrBefore(end)) {
      start = start.subtract(1, 'day');
    } else {
      end = end.add(1, 'day');
    }
  }

  // console.log([date.format(), start.format(), end.format()]);
  return date.isBetween(start, end, null, '[]');
}

function isOpen(date, openingTimes) {
  // TODO: handle multiple opening times during a day (e.g. when closed for lunch
  return openingTimes[0] !== 'Closed' &&
    timeInRange(
    date,
    openingTimes[0].fromTime,
    openingTimes[0].toTime
  );
}

module.exports = {
  timeInRange,
  getDayName,
  isOpen,
  now,
  nowForDisplay,
  setNow,
};
