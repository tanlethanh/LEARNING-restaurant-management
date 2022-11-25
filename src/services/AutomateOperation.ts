import { getHoursAndMinutesString } from "../utils/dateUtils"

class AutomateOperation {

    DURATION = 5
    
    public static getOpenAndCloseTime() {
        const openTime = new Date()
        const closeTime = new Date()
        closeTime.setMinutes(closeTime.getMinutes() + 5)
        return {
            open: getHoursAndMinutesString(openTime),
            close: getHoursAndMinutesString(closeTime)
        }
    }

    public static caculateTimestamp () {

    }

    public static start() {
        const time 

    }   


}