export const generateOtp = (): string => {
    return String(Math.floor(Math.random() *  100000 + 900000 ));
}

export const generateTimestamp = (timeInMinutes : string ): Date => {
    const currentDate = new Date();
    const minutesToAdd = parseInt(timeInMinutes, 10);
    currentDate.setMinutes(currentDate.getMinutes() + minutesToAdd);
    return currentDate;
}   