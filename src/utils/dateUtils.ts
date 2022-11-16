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