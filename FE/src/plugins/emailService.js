import emailjs from '@emailjs/browser'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

if (!publicKey) {
  console.warn('EmailJS public key is missing. Please set VITE_EMAILJS_PUBLIC_KEY in .env')
} else {
  emailjs.init(publicKey)
}

/**
 * Hàm gửi mail liên hệ qua EmailJS dùng file .env
 * @param {HTMLFormElement} formElement - Element form nhận từ Vue
 */
export const sendContactEmail = async (formElement) => {
  if (!serviceId || !templateId || !publicKey) {
    console.error('EmailJS configuration is incomplete:', {
      serviceId,
      templateId,
      publicKey: Boolean(publicKey)
    })
    return {
      success: false,
      message: 'EmailJS chưa được cấu hình đầy đủ. Vui lòng kiểm tra file .env.'
    }
  }

  try {
    await emailjs.sendForm(serviceId, templateId, formElement)
    return { success: true, message: 'Gửi tin nhắn thành công!' }
  } catch (error) {
    console.error('EmailJS Error:', error)
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau!' }
  }
}