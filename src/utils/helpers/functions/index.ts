export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export const formatDate = (date: Date, time: boolean) => {
  if (time) {
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return (
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "/" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      "  " +
      strTime
    );
  } else {
    return (
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "/" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "/" +
      date.getFullYear()
    );
  }
};
