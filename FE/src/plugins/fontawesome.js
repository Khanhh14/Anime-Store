import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. Import các icon Solid (Nét đặc)
import { 
  faBars, 
  faLocationDot, 
  faPhone, 
  faEnvelope,
  faHeart as fasHeart // Tim đặc
} from '@fortawesome/free-solid-svg-icons'

// 2. Import icon Regular (Nét mảnh/viền rỗng)
import { 
  faHeart as farHeart // Tim rỗng
} from '@fortawesome/free-regular-svg-icons'

// Đăng ký toàn bộ vào thư viện
library.add(
  faBars, 
  faLocationDot, 
  faPhone, 
  faEnvelope, 
  fasHeart, 
  farHeart
)

export { FontAwesomeIcon }