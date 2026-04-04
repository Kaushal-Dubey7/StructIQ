import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { MapPin, Calendar, Users, Car, PersonStanding, Bus } from 'lucide-react'

const travelModes = [
  { value: 'driving', label: 'Driving', icon: Car },
  { value: 'walking', label: 'Walking', icon: PersonStanding },
  { value: 'transit', label: 'Transit', icon: Bus },
]

const priorities = [
  { value: 'routine', label: 'Routine', color: 'text-success' },
  { value: 'urgent', label: 'Urgent', color: 'text-warning' },
  { value: 'critical', label: 'Critical', color: 'text-danger' },
]

export function MissionForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    title: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelMode: 'driving',
    teamSize: 2,
    priority: 'routine',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Mission title is required'
    if (!form.origin.trim()) errs.origin = 'Origin city is required'
    if (!form.destination.trim()) errs.destination = 'Destination city is required'
    if (!form.startDate) errs.startDate = 'Start date is required'
    if (!form.endDate) errs.endDate = 'End date is required'
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      errs.endDate = 'End date must be after start date'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-4">Mission Parameters</p>

      <Input
        label="Mission Title"
        placeholder="Operation Nightfall"
        value={form.title}
        onChange={e => handleChange('title', e.target.value)}
        error={errors.title}
      />

      <Input
        label="Origin City"
        placeholder="Detroit, MI"
        icon={MapPin}
        value={form.origin}
        onChange={e => handleChange('origin', e.target.value)}
        error={errors.origin}
      />

      <Input
        label="Destination City"
        placeholder="Cleveland, OH"
        icon={MapPin}
        value={form.destination}
        onChange={e => handleChange('destination', e.target.value)}
        error={errors.destination}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          icon={Calendar}
          value={form.startDate}
          onChange={e => handleChange('startDate', e.target.value)}
          error={errors.startDate}
        />
        <Input
          label="End Date"
          type="date"
          icon={Calendar}
          value={form.endDate}
          onChange={e => handleChange('endDate', e.target.value)}
          error={errors.endDate}
        />
      </div>

      {/* Travel Mode */}
      <div>
        <label className="block text-[13px] font-medium text-text-primary mb-2">Travel Mode</label>
        <div className="flex border border-border rounded-[6px] overflow-hidden">
          {travelModes.map(mode => (
            <button
              key={mode.value}
              type="button"
              onClick={() => handleChange('travelMode', mode.value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-medium transition-all duration-150 ${
                form.travelMode === mode.value
                  ? 'bg-blue-accent text-white'
                  : 'bg-white text-muted hover:bg-card'
              }`}
            >
              <mode.icon className="w-4 h-4" />
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Size */}
      <div>
        <label className="block text-[13px] font-medium text-text-primary mb-2">Team Size</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChange('teamSize', Math.max(1, form.teamSize - 1))}
            className="w-8 h-8 flex items-center justify-center border border-border rounded text-muted hover:bg-card transition-colors"
          >
            -
          </button>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted" />
            <span className="font-mono text-[16px] font-semibold w-8 text-center">{form.teamSize}</span>
          </div>
          <button
            type="button"
            onClick={() => handleChange('teamSize', Math.min(20, form.teamSize + 1))}
            className="w-8 h-8 flex items-center justify-center border border-border rounded text-muted hover:bg-card transition-colors"
          >
            +
          </button>
          <span className="text-[12px] text-muted">agents</span>
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-[13px] font-medium text-text-primary mb-2">Priority Level</label>
        <select
          value={form.priority}
          onChange={e => handleChange('priority', e.target.value)}
          className="w-full px-3 py-2 text-[14px] bg-white border border-border rounded focus:outline-none focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent"
        >
          {priorities.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Creating...' : 'CREATE MISSION'}
      </Button>
    </form>
  )
}
