/// <reference types="@tarojs/taro" />
/// <reference types="@tarojs/components" />

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
declare module '*.mp3'
declare module '*.ttf'
declare module '*.woff'
declare module '*.woff2'

// Taro declarations
declare const wx: any

declare namespace JSX {
  interface IntrinsicElements {
    'taro-view': any
    'taro-text': any
    'taro-image': any
    'taro-button': any
    'taro-input': any
    'taro-textarea': any
    'taro-scroll-view': any
    'taro-swiper': any
    'taro-swiper-item': any
    'taro-map': any
    'taro-form': any
    'taro-label': any
    'taro-checkbox': any
    'taro-checkbox-group': any
    'taro-radio': any
    'taro-radio-group': any
    'taro-picker': any
    'taro-picker-view': any
    'taro-switch': any
    'taro-slider': any
    'taro-icon': any
    'taro-progress': any
    'taro-rich-text': any
    'taro-navigator': any
    'taro-audio': any
    'taro-video': any
    'taro-camera': any
    'taro-image-editor': any
    'taro-live-player': any
    'taro-live-pusher': any
    'taro-official-account': any
    'taro-open-data': any
    'taro-web-view': any
    'taro-ad': any
    'taro-ad-custom': any
    'taro-cover-image': any
    'taro-cover-view': any
    'taro-match-media': any
    'taro-movable-area': any
    'taro-movable-view': any
    'taro-page-container': any
    'taro-root-portal': any
    'taro-share-element': any
    'taro-snapshot': any
    'taro-sticky-header': any
    'taro-sticky-section': any
    'taro-swiper-item': any
    'taro-grid-view': any
    'taro-list-view': any
    'taro-list-item': any
    'taro-nested-scroll-header': any
    'taro-nested-scroll-body': any
  }
}
