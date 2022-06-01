import twoDigit from "./twoDigit";

export default function createdAtFormat(date) {
  let endChar = "T00:00:00.000Z";
  twoDigit(date.getFullYear());
  return (
    date.getFullYear() +
    "-" +
    twoDigit(date.getMonth() + 1) +
    "-" +
    twoDigit(date.getDate()) +
    endChar
  );
}
