export interface GeoIpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  isp: string;
  timezone: string;
}

// In-memory cache to prevent redundant external API calls
const ipCache = new Map<string, GeoIpInfo>();

/**
 * Resolves the real public IP address if on localhost or proxy
 */
export async function getLivePublicIp(fallbackIp?: string): Promise<string> {
  // If we already have a valid public IPv4/IPv6 that is not loopback/private
  if (fallbackIp && !isPrivateIp(fallbackIp)) {
    return fallbackIp;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.ip) return data.ip;
    }
  } catch (err) {
    // ignore
  }

  return fallbackIp && fallbackIp !== '::1' ? fallbackIp : '72.255.61.191';
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.31.')
  );
}

/**
 * Resolves live geolocation and ISP details for a given IP address
 */
export async function resolveIpDetails(targetIp: string): Promise<GeoIpInfo> {
  // Check cache
  if (ipCache.has(targetIp)) {
    return ipCache.get(targetIp)!;
  }

  // Fallback default
  let info: GeoIpInfo = {
    ip: targetIp,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    countryCode: 'PK',
    isp: 'Cyber Internet Services',
    timezone: 'Asia/Karachi',
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`http://ip-api.com/json/${targetIp}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        info = {
          ip: targetIp,
          city: data.city || 'Karachi',
          region: data.regionName || 'Sindh',
          country: data.country || 'Pakistan',
          countryCode: data.countryCode || 'PK',
          isp: data.isp || data.org || 'Internet Provider',
          timezone: data.timezone || 'Asia/Karachi',
        };
      }
    }
  } catch (err) {
    // Secondary fallback
    try {
      const res2 = await fetch(`https://ipapi.co/${targetIp}/json/`);
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.city) {
          info = {
            ip: targetIp,
            city: data2.city,
            region: data2.region || '',
            country: data2.country_name || 'Pakistan',
            countryCode: data2.country_code || 'PK',
            isp: data2.org || 'Internet Provider',
            timezone: data2.timezone || 'Asia/Karachi',
          };
        }
      }
    } catch (e) {
      // Keep default info
    }
  }

  ipCache.set(targetIp, info);
  return info;
}
