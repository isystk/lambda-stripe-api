import { css, keyframes } from '@emotion/css'

export const overlayBackground = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(100, 100, 100, 0.8);
  z-index: 1000;
`

export const overlay = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 24px;
  text-align: center;
  z-index: 1001;
  max-width: 90%;
`

export const wrap = css`
  background-color: #fff;
  padding: 20px 10px 40px;
`

export const closeBtn = css`
  position: absolute !important;
  top: 5px;
  right: 10px;
  width: 35px !important;
  height: 20px !important;
`
