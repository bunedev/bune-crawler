export function getRandomUSLocation() {
    const minLat = 24.396308; // Điểm cực nam (Florida Keys)
    const maxLat = 49.384358; // Điểm cực bắc (Minnesota)
    const minLon = -125.000000; // Điểm cực tây (California)
    const maxLon = -66.934570; // Điểm cực đông (Maine)

    const latitude = (Math.random() * (maxLat - minLat)) + minLat;
    const longitude = (Math.random() * (maxLon - minLon)) + minLon;

    return { latitude, longitude };
}