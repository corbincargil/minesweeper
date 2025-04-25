/** Takes in time (in tenths of a second) and returns a formatted time string in MM:SS.T format */
export default function (time: number) {
  const minutes = Math.floor(time / 600);
  const seconds = Math.floor((time % 600) / 10);
  const tenths = time % 10;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}
