import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    // Controls which days/times a doctor accepts appointments.
    // New format: schedule.weekly[0..6] = { enabled, startTime: "HH:MM", endTime: "HH:MM" }
    // Backward compatible with legacy fields used by older doctors.
    schedule: {
        weekly: { type: Object, default: {} },
        slotMinutes: { type: Number, default: 30 },
        // legacy (kept for backward compatibility)
        daysOfWeek: { type: [Number], default: [1, 2, 3, 4, 5, 6] }, // Mon-Sat
        startHour: { type: Number, default: 10 }, // 0-23
        startMinute: { type: Number, default: 0 }, // 0-59
        endHour: { type: Number, default: 21 }, // 0-23
        endMinute: { type: Number, default: 0 }, // 0-59
    },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;