import mongoose from 'mongoose'

const missionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travelMode: { type: String, enum: ['driving', 'walking', 'transit'], default: 'driving' },
  teamSize: { type: Number, default: 1 },
  priority: { type: String, enum: ['routine', 'urgent', 'critical'], default: 'routine' },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
  result: {
    weather: { type: Object, default: null },
    route: { type: Object, default: null },
    budget: { type: Object, default: null },
    itinerary: { type: String, default: null }
  },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Mission', missionSchema)
