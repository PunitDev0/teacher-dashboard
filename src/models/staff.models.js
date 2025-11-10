import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: true,
    },
    nationality: { type: String, required: true },
    religion: { type: String },
    photo: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    currentAddress: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    emergencyContactPerson: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    emergencyContactRelation: { type: String, required: true },
    employeeId: { type: String, unique: true }, // auto-generated now
    dateOfJoining: { type: Date, required: true },
    department: {
      type: String,
      enum: [
        "Teaching",
        "Non-Teaching",
        "Administration",
        "Accounts",
        "IT",
        "Library",
        "Lab Assistant",
      ],
      required: true,
    },
    designation: {
      type: String,
      enum: [
        "Teacher",
        "Principal",
        "Clerk",
        "Accountant",
        "Librarian",
        "Lab Assistant",
      ],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
      required: true,
    },
    workShiftTiming: {
      type: String,
      enum: ["Morning (8AM-2PM)", "Afternoon (12PM-6PM)", "Evening (4PM-10PM)"],
      required: true,
    },
    highestQualification: { type: String, required: true },
    aadhaarCard: { type: String, required: true },
    panCard: { type: String, required: true },
    educationalCertificates: { type: String },
    bankAccountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    leaveQuota: {
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 10 },
      unpaid: { type: String, default: "unlimited" },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Auto-generate employeeId before saving new staff
staffSchema.pre("save", async function (next) {
  if (!this.isNew || this.employeeId) return next();

  const year = new Date().getFullYear().toString(); // e.g., "2025"

  try {
    // Find the last staff created this year
    const lastStaff = await mongoose.models.Staff.findOne({
      employeeId: { $regex: `EMP-${year}-` },
    })
      .sort({ employeeId: -1 })
      .exec();

    let nextSerial = 1;

    if (lastStaff) {
      const lastId = lastStaff.employeeId; // e.g., "EMP-2025-00025"
      const parts = lastId.split("-");
      const lastSerial = parseInt(parts[2], 10);
      nextSerial = lastSerial + 1;
    }

    const serial = nextSerial.toString().padStart(5, "0");
    this.employeeId = `EMP-${year}-${serial}`;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Staff || mongoose.model("Staff", staffSchema);
