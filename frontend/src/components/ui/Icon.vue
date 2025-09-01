<template>
  <i :class="iconClass" :style="iconStyle"></i>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: string | number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '1em',
  color: 'currentColor'
})

const iconClass = computed(() => {
  // Mapping des noms d'icônes vers les classes CSS
  const iconMap: Record<string, string> = {
    // User & Profile
    'user': '👤',
    'users': '👥',
    'user-plus': '👤➕',
    'user-check': '👤✅',
    'user-x': '👤❌',
    
    // Navigation
    'home': '🏠',
    'menu': '☰',
    'search': '🔍',
    'filter': '🔽',
    'sort': '↕️',
    
    // Actions
    'edit': '✏️',
    'save': '💾',
    'delete': '🗑️',
    'trash': '🗑️',
    'add': '➕',
    'plus': '➕',
    'minus': '➖',
    'check': '✅',
    'check-circle': '✅',
    'x': '❌',
    'close': '❌',
    
    // Navigation arrows
    'arrow-left': '←',
    'arrow-right': '→',
    'arrow-up': '↑',
    'arrow-down': '↓',
    'chevron-left': '‹',
    'chevron-right': '›',
    'chevron-up': '⌃',
    'chevron-down': '⌄',
    
    // Status & Notifications
    'bell': '🔔',
    'notification': '🔔',
    'alert': '⚠️',
    'warning': '⚠️',
    'info': 'ℹ️',
    'error': '❌',
    'success': '✅',
    
    // Security & Auth
    'shield': '🛡️',
    'lock': '🔒',
    'unlock': '🔓',
    'key': '🔑',
    'eye': '👁️',
    'eye-off': '🙈',
    
    // Communication
    'mail': '📧',
    'message': '💬',
    'phone': '📞',
    'chat': '💬',
    
    // Files & Documents
    'file': '📄',
    'folder': '📁',
    'image': '🖼️',
    'camera': '📷',
    'upload': '📤',
    'download': '📥',
    
    // Time & Calendar
    'clock': '🕐',
    'calendar': '📅',
    'date': '📅',
    'schedule': '📋',
    
    // Settings & Tools
    'settings': '⚙️',
    'cog': '⚙️',
    'tool': '🔧',
    'wrench': '🔧',
    
    // Social & Sharing
    'share': '🔗',
    'link': '🔗',
    'bookmark': '🔖',
    'heart': '❤️',
    'star': '⭐',
    'like': '👍',
    
    // Business & Finance
    'dollar': '💰',
    'euro': '€',
    'card': '💳',
    'bank': '🏦',
    'chart': '📊',
    'trending': '📈',
    
    // Location & Maps
    'map': '🗺️',
    'location': '📍',
    'pin': '📌',
    'globe': '🌍',
    
    // Technology
    'wifi': '📶',
    'bluetooth': '📶',
    'battery': '🔋',
    'signal': '📶',
    'monitor': '🖥️',
    'smartphone': '📱',
    
    // Actions & Status
    'play': '▶️',
    'pause': '⏸️',
    'stop': '⏹️',
    'refresh': '🔄',
    'sync': '🔄',
    'loading': '⏳',
    
    // Auth & Session
    'log-in': '🔐',
    'log-out': '🚪',
    'login': '🔐',
    'logout': '🚪',
    
    // Content
    'text': '📝',
    'quote': '💬',
    'code': '💻',
    'terminal': '⌨️',
    
    // Transportation
    'car': '🚗',
    'plane': '✈️',
    'train': '🚄',
    'bike': '🚲',
    
    // Weather
    'sun': '☀️',
    'moon': '🌙',
    'cloud': '☁️',
    'rain': '🌧️',
    
    // Gaming & Entertainment
    'game': '🎮',
    'music': '🎵',
    'video': '🎥',
    'tv': '📺',
    
    // Health & Medical
    'heart-pulse': '💓',
    'medical': '⚕️',
    'pills': '💊',
    
    // Shopping & Commerce
    'shopping': '🛒',
    'bag': '🛍️',
    'gift': '🎁',
    'package': '📦',
    
    // Education
    'book': '📚',
    'graduation': '🎓',
    'school': '🏫',
    
    // Nature & Environment
    'tree': '🌳',
    'flower': '🌸',
    'leaf': '🍃',
    
    // Food & Drink
    'coffee': '☕',
    'food': '🍽️',
    'restaurant': '🍽️',
    
    // Miscellaneous
    'question': '❓',
    'help': '❓',
    'activity': '📊',
    'analytics': '📊',
    'dashboard': '📊',
    'inbox': '📥',
    'outbox': '📤',
    'archive': '📦',
    'backup': '💾',
    'database': '🗄️',
    'server': '🖥️'
  }

  return `icon icon-${props.name}`
})

const iconStyle = computed(() => {
  const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
  
  return {
    fontSize: sizeValue,
    color: props.color,
    display: 'inline-block',
    lineHeight: '1',
    verticalAlign: 'middle'
  }
})

// Fonction pour obtenir l'emoji correspondant à l'icône
const getIconEmoji = (name: string): string => {
  const iconMap: Record<string, string> = {
    // User & Profile
    'user': '👤',
    'users': '👥',
    'user-plus': '👤',
    'user-check': '✅',
    'user-x': '❌',
    
    // Navigation
    'home': '🏠',
    'menu': '☰',
    'search': '🔍',
    'filter': '🔽',
    'sort': '↕️',
    
    // Actions
    'edit': '✏️',
    'save': '💾',
    'delete': '🗑️',
    'trash': '🗑️',
    'add': '➕',
    'plus': '➕',
    'minus': '➖',
    'check': '✅',
    'check-circle': '✅',
    'x': '❌',
    'close': '❌',
    
    // Navigation arrows
    'arrow-left': '←',
    'arrow-right': '→',
    'arrow-up': '↑',
    'arrow-down': '↓',
    'chevron-left': '‹',
    'chevron-right': '›',
    'chevron-up': '⌃',
    'chevron-down': '⌄',
    
    // Status & Notifications
    'bell': '🔔',
    'notification': '🔔',
    'alert': '⚠️',
    'warning': '⚠️',
    'info': 'ℹ️',
    'error': '❌',
    'success': '✅',
    
    // Security & Auth
    'shield': '🛡️',
    'lock': '🔒',
    'unlock': '🔓',
    'key': '🔑',
    'eye': '👁️',
    'eye-off': '🙈',
    
    // Communication
    'mail': '📧',
    'message': '💬',
    'phone': '📞',
    'chat': '💬',
    
    // Files & Documents
    'file': '📄',
    'folder': '📁',
    'image': '🖼️',
    'camera': '📷',
    'upload': '📤',
    'download': '📥',
    
    // Time & Calendar
    'clock': '🕐',
    'calendar': '📅',
    'date': '📅',
    'schedule': '📋',
    
    // Settings & Tools
    'settings': '⚙️',
    'cog': '⚙️',
    'tool': '🔧',
    'wrench': '🔧',
    
    // Business & Finance
    'dollar': '💰',
    'euro': '€',
    'card': '💳',
    'bank': '🏦',
    'chart': '📊',
    'trending': '📈',
    
    // Location & Maps
    'map': '🗺️',
    'location': '📍',
    'pin': '📌',
    'globe': '🌍',
    
    // Technology
    'wifi': '📶',
    'monitor': '🖥️',
    'smartphone': '📱',
    
    // Actions & Status
    'play': '▶️',
    'pause': '⏸️',
    'stop': '⏹️',
    'refresh': '🔄',
    'sync': '🔄',
    'loading': '⏳',
    
    // Auth & Session
    'log-in': '🔐',
    'log-out': '🚪',
    'login': '🔐',
    'logout': '🚪',
    
    // Content
    'text': '📝',
    'code': '💻',
    
    // Miscellaneous
    'question': '❓',
    'help': '❓',
    'activity': '📊',
    'analytics': '📊',
    'dashboard': '📊'
  }

  return iconMap[name] || '📄'
}
</script>

<style scoped>
.icon {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  font-style: normal;
  user-select: none;
}

/* Mapping des icônes vers des caractères Unicode ou emojis */
.icon-user::before { content: '👤'; }
.icon-users::before { content: '👥'; }
.icon-user-plus::before { content: '👤'; }
.icon-user-check::before { content: '✅'; }
.icon-user-x::before { content: '❌'; }

.icon-home::before { content: '🏠'; }
.icon-menu::before { content: '☰'; }
.icon-search::before { content: '🔍'; }
.icon-filter::before { content: '🔽'; }
.icon-sort::before { content: '↕️'; }

.icon-edit::before { content: '✏️'; }
.icon-save::before { content: '💾'; }
.icon-delete::before { content: '🗑️'; }
.icon-trash::before { content: '🗑️'; }
.icon-add::before { content: '➕'; }
.icon-plus::before { content: '➕'; }
.icon-minus::before { content: '➖'; }
.icon-check::before { content: '✅'; }
.icon-check-circle::before { content: '✅'; }
.icon-x::before { content: '❌'; }
.icon-close::before { content: '❌'; }

.icon-arrow-left::before { content: '←'; }
.icon-arrow-right::before { content: '→'; }
.icon-arrow-up::before { content: '↑'; }
.icon-arrow-down::before { content: '↓'; }
.icon-chevron-left::before { content: '‹'; }
.icon-chevron-right::before { content: '›'; }
.icon-chevron-up::before { content: '⌃'; }
.icon-chevron-down::before { content: '⌄'; }

.icon-bell::before { content: '🔔'; }
.icon-notification::before { content: '🔔'; }
.icon-alert::before { content: '⚠️'; }
.icon-warning::before { content: '⚠️'; }
.icon-info::before { content: 'ℹ️'; }
.icon-error::before { content: '❌'; }
.icon-success::before { content: '✅'; }

.icon-shield::before { content: '🛡️'; }
.icon-lock::before { content: '🔒'; }
.icon-unlock::before { content: '🔓'; }
.icon-key::before { content: '🔑'; }
.icon-eye::before { content: '👁️'; }
.icon-eye-off::before { content: '🙈'; }

.icon-mail::before { content: '📧'; }
.icon-message::before { content: '💬'; }
.icon-phone::before { content: '📞'; }
.icon-chat::before { content: '💬'; }

.icon-file::before { content: '📄'; }
.icon-folder::before { content: '📁'; }
.icon-image::before { content: '🖼️'; }
.icon-camera::before { content: '📷'; }
.icon-upload::before { content: '📤'; }
.icon-download::before { content: '📥'; }

.icon-clock::before { content: '🕐'; }
.icon-calendar::before { content: '📅'; }
.icon-date::before { content: '📅'; }
.icon-schedule::before { content: '📋'; }

.icon-settings::before { content: '⚙️'; }
.icon-cog::before { content: '⚙️'; }
.icon-tool::before { content: '🔧'; }
.icon-wrench::before { content: '🔧'; }

.icon-dollar::before { content: '💰'; }
.icon-euro::before { content: '€'; }
.icon-card::before { content: '💳'; }
.icon-bank::before { content: '🏦'; }
.icon-chart::before { content: '📊'; }
.icon-trending::before { content: '📈'; }

.icon-map::before { content: '🗺️'; }
.icon-location::before { content: '📍'; }
.icon-pin::before { content: '📌'; }
.icon-globe::before { content: '🌍'; }

.icon-wifi::before { content: '📶'; }
.icon-monitor::before { content: '🖥️'; }
.icon-smartphone::before { content: '📱'; }

.icon-play::before { content: '▶️'; }
.icon-pause::before { content: '⏸️'; }
.icon-stop::before { content: '⏹️'; }
.icon-refresh::before { content: '🔄'; }
.icon-sync::before { content: '🔄'; }
.icon-loading::before { content: '⏳'; }

.icon-log-in::before { content: '🔐'; }
.icon-log-out::before { content: '🚪'; }
.icon-login::before { content: '🔐'; }
.icon-logout::before { content: '🚪'; }

.icon-text::before { content: '📝'; }
.icon-code::before { content: '💻'; }

.icon-question::before { content: '❓'; }
.icon-help::before { content: '❓'; }
.icon-activity::before { content: '📊'; }
.icon-analytics::before { content: '📊'; }
.icon-dashboard::before { content: '📊'; }

/* Animation pour les icônes interactives */
.icon {
  transition: transform 0.2s ease, color 0.2s ease;
}

.icon:hover {
  transform: scale(1.1);
}

/* Tailles prédéfinies */
.icon.small {
  font-size: 0.875rem;
}

.icon.medium {
  font-size: 1.125rem;
}

.icon.large {
  font-size: 1.5rem;
}

.icon.xl {
  font-size: 2rem;
}

/* États */
.icon.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.icon.active {
  color: var(--electric-blue);
}
</style>
