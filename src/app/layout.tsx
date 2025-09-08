import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: '台北機車檢驗站地圖',
  description:
    '台北市機車排氣檢驗站地圖查詢系統，提供各個檢驗站的詳細資訊、地址、電話與地圖導航功能，幫助機車族快速找到最近的檢驗站。',
  keywords: '台北,機車,檢驗站,排氣檢驗,地圖,導航,機車族'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
