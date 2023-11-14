export const epochSeconds = () => Math.floor(Date.now() / 1000);

export const epochSecondsAfter = (interval: number) => epochSeconds() + interval;
