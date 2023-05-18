import { Url } from './url'

type MenuItem = {
  label: string
  href: string
  target?: '_blank'
}

/**
 * メニュー を管理する
 */
export const frontMenuItems: MenuItem[] = [
  {
    label: 'Home',
    href: Url.Top,
  },
  {
    label: 'Rates',
    href: Url.Payment,
  },
  {
    label: 'Contact Us',
    href: 'https://blog.isystk.com/contact/',
    target: '_blank',
  },
]

export const frontFooterMenuItems: MenuItem[] = [
  {
    label: 'Company',
    href: 'https://blog.isystk.com/company/',
    target: '_blank',
  },
  {
    label: 'Privacy Policy',
    href: 'https://blog.isystk.com/privacy-poricy/',
    target: '_blank',
  },
  {
    label: 'Contact Us',
    href: 'https://blog.isystk.com/contact/',
    target: '_blank',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/ise0615',
    target: '_blank',
  },
]

export const adminMenuItems: MenuItem[] = [
  {
    label: '商品一覧',
    href: '#',
  },
  {
    label: '契約者一覧',
    href: '#',
  },
]
