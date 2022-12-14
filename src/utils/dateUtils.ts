export function isInNowToEndDay(date: Date) {
    const now = new Date()
    const endToday = new Date()
    endToday.setHours(23, 59, 59, 999)
    return (date >= now) && (date <= endToday)
}

export function startToday() {
    const startToday = new Date()
    startToday.setHours(0, 0, 0, 0)  
    return startToday    
}

export function endToday() {
    const endToday = new Date()
    endToday.setHours(23, 59, 59, 999)
    return endToday
}

export function startOfDay(date: Date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)  
    return startOfDay 
}

export function endOfDay(date: Date) {
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 9990)  
    return endOfDay
}

export function getHoursAndMinutesString(date: Date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${hours >= 10? hours: "0" + String(hours)}:${minutes >= 10? minutes: "0" + String(hours)}`
}

export function getHoursAndMinutesAndSecondsString(date: Date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${hours >= 10? hours: "0" + String(hours)}:${minutes >= 10? minutes: "0" + String(minutes)}:${seconds >= 10? seconds: "0" + String(seconds)}`
}