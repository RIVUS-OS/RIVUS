'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FormData {
  project_name: string
  oib: string
  address: string
  city: string
  owner_name: string
}

interface Props {
  onSuccess?: () => void
}

export default function SpvCreateForm({ onSuccess }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    project_name: '',
    oib: '',
    address: '',
    city: '',
    owner_name: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/spv/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Greska pri kreiranju SPV-a')
        return
      }

      // Uspjeh
      router.refresh()
      onSuccess?.()
    } catch {
      setError('Mrezna greska. Pokusaj ponovo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Naziv SPV-a <span className="text-red-500">*</span>
        </label>
        <input
          name="project_name"
          value={form.project_name}
          onChange={handleChange}
          placeholder="npr. sandora Petefija d.o.o."
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          OIB <span className="text-red-500">*</span>
        </label>
        <input
          name="oib"
          value={form.oib}
          onChange={handleChange}
          placeholder="11 znamenki"
          maxLength={11}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresa <span className="text-red-500">*</span>
        </label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Ulica i broj"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grad <span className="text-red-500">*</span>
        </label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="npr. Zagreb"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vlasnik (Owner) <span className="text-red-500">*</span>
        </label>
        <input
          name="owner_name"
          value={form.owner_name}
          onChange={handleChange}
          placeholder="Ime i prezime direktora"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
      >
        {loading ? 'Kreiranje...' : 'Kreiraj SPV'}
      </button>

      <p className="text-xs text-gray-500">
        RIVUS kreira SPV entitet u sustavu. Pravnu osobnost SPV-a osniva vlasnik zasebno.
        Odgovornost za vodenje poslovanja ostaje na vlasniku (ZTD cl. 240).
      </p>
    </form>
  )
}
