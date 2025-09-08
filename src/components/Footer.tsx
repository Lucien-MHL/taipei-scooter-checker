import { formatDate } from '@/utils/formatDate'

export const Footer = () => {
  return (
    <footer className="w-full">
      <div className="w-3/4 ml-auto flex items-center justify-between px-3 py-2 text-sm text-gray-300 text-center">
        <Date />
        <p>
          資料來源：
          <a
            href="https://data.taipei/dataset/detail?id=a81edafd-c1e9-4678-9df2-bad8ce0fc383"
            className="hover:text-blue-950"
          >
            台北市資料大平臺
          </a>
        </p>
      </div>
    </footer>
  )
}

const Date = () => {
  return <p>更新日期：{formatDate('2025-09-05T13:58:42.082Z')}</p>
}
