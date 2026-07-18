// countries.js
export const countryList = [
  { name: 'Việt Nam', code: 'VN', flag: 'vn' },
  { name: 'Nhật Bản', code: 'JP', flag: 'jp' },
  { name: 'Hàn Quốc', code: 'KR', flag: 'kr' },
  { name: 'Trung Quốc', code: 'CN', flag: 'cn' },
  { name: 'Đài Loan', code: 'TW', flag: 'tw' },
  { name: 'Mỹ (United States)', code: 'US', flag: 'us' },
  { name: 'Anh (United Kingdom)', code: 'GB', flag: 'gb' },
  { name: 'Pháp', code: 'FR', flag: 'fr' },
  { name: 'Đức', code: 'DE', flag: 'de' },
  { name: 'Thái Lan', code: 'TH', flag: 'th' },
  { name: 'Singapore', code: 'SG', flag: 'sg' },
  { name: 'Hồng Kông', code: 'HK', flag: 'hk' },
  { name: 'Canada', code: 'CA', flag: 'ca' },
  { name: 'Úc (Australia)', code: 'AU', flag: 'au' }
].sort((a, b) => a.name.localeCompare(b.name))