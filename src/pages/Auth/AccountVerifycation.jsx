import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerifycation() {
  // Lấy giá trị của email và token từ url
  let [searchParams] = useSearchParams()
  // console.log('🚀 ~ AccountVerifycation ~ searchParams:', searchParams)
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')

  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo State để biết được tài khoản đã được verify hay chưa

  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  // Nếu url có vấn đề, không có giá trị email và token thì cho ra trang 404
  if (!email || !token) {
    return <Navigate to="/404" />
  }
  // Nếu cho veryfi xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }
  // Nếu verify thành công thì cho vế trang login
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerifycation