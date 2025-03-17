import mongoose, { Schema, Document } from "mongoose";

type Shalat = "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";
type LokasiShalat = "Rumah" | "Masjid";
type TarawihOption = "Tidak" | "8 Rakaat" | "20 Rakaat";

interface Ibadah extends Document {
  date: Date;
  shalatWajib: Shalat[];
  lokasiShalat: Partial<Record<Shalat, LokasiShalat>>;
  tilawah: number;
  juz?: string;
  halamanTerakhir: number;
  puasa: "Sempurna" | "Tidak Sempurna";
  tarawih: TarawihOption;
  lokasiTarawih?: LokasiShalat;
  khatamQuran: number;
}

const IbadahSchema = new Schema<Ibadah>({
  date: { type: Date, required: true, unique: true },
  shalatWajib: {
    type: [String],
    enum: ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"],
    required: true,
  },
  lokasiShalat: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  tilawah: { type: Number, required: true, default: 0 },
  juz: { type: String },
  halamanTerakhir: { type: Number, min: 1, max: 604, default: 1 },
  puasa: { type: String, enum: ["Sempurna", "Tidak Sempurna"], required: true },
  tarawih: {
    type: String,
    enum: ["Tidak", "8 Rakaat", "20 Rakaat"],
    required: true,
    default: "Tidak",
  },
  lokasiTarawih: {
    type: String,
    enum: ["Rumah", "Masjid"],
    required: function (this: Ibadah) {
      return this.tarawih !== "Tidak";
    },
  },
  khatamQuran: { type: Number, required: true, default: 0, min: 0 },
});

export default mongoose.models.Ibadah ||
  mongoose.model<Ibadah>("Ibadah", IbadahSchema);
