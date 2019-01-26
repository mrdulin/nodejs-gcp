function sleep(ms, verbose) {
  if (verbose) {
    const unit = 1000;
    console.log(`start the timer...${ms / unit}s`);
    const intervalId = setInterval(() => {
      ms -= unit;
      if (ms > 0) {
        console.log(`${ms / unit}s`);
      } else {
        clearInterval(intervalId);
      }
    }, unit);
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { sleep };
