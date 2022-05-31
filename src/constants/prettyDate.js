export default function prettyDate(date) {
  let newDate = new Date(date);
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return (
    newDate.getDate() +
    " " +
    monthNames[newDate.getMonth()] +
    " " +
    newDate.getFullYear()
  );
}
