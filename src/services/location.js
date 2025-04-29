const getVisitorIp = async () => {
    try {
        const response = await fetch('https://api.ipify.org');
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

const fetchIPinfo = async (ip) => {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}/geo`);
        const data = await response.json();
        const province = data.city;
        return province;
    }
    catch (error) {
        console.error('Error fetching geolocation data:', error);
    }
}

export const getCurrentLocation = async () => {
    try {
        const ip = await getVisitorIp();
        const province = await fetchIPinfo(ip);
        return province;
    } catch (error) {
        alert('ไม่สามารถค้นหาตำแหน่งของคุณได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณหรืออนุญาตให้เข้าถึงตำแหน่ง');
        console.error('Error getting current location:', error);
    }
}