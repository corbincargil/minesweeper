/** Takes in remaining flag count as a number and formats it to a string with XXX format */
export default function (flags: number) {
  return flags.toString().padStart(3, "0");
}
