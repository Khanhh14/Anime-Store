import emailjs from '@emailjs/browser'

/**
 * Hàm gửi mail liên hệ qua EmailJS dùng file .env
 * @param {HTMLFormElement} formElement - Element form nhận từ Vue
 */
export const sendContactEmail = async (formElement) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  try {
    await emailjs.sendForm(serviceId, templateId, formElement, publicKey)
    return { success: true, message: 'Gửi tin nhắn thành công!' }
  } catch (error) {
    console.error('EmailJS Error:', error)
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau!' }
  }
}