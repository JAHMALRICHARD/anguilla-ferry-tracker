'use client'

import { useEffect, useState } from 'react'
import Flag from 'react-world-flags'
import { ChevronDownIcon } from 'lucide-react'

type Language = {
  code: string
  label: string
}

const languages: Language[] = [
  { code: 'gb', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ru', label: 'Русский' }
]

export default function LanguageDropdown() {
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('preferred-language')
    if (saved) {
      const lang = languages.find((l) => l.code === saved)
      if (lang) setSelectedLang(lang)
    }
  }, [])

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang)
    setOpen(false)
    localStorage.setItem('preferred-language', lang.code)
    // Optional: i18n.changeLanguage(lang.code)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-[#1E2A3B] rounded-lg flex items-center gap-2 transition-colors"
        aria-label="Select Language"
      >
        <Flag code={selectedLang.code} className="h-5 w-5 rounded object-cover" alt={selectedLang.label} />
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[#1E2A3B] border border-gray-700 rounded-lg shadow-lg z-50">
          {languages.map((lang: Language) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#252F3F] flex items-center gap-3 transition"
            >
              <Flag code={lang.code} className="h-4 w-4 rounded object-cover" alt={lang.label} />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
