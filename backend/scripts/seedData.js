import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Machine from '../models/Machine.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Machine.deleteMany({});

    // Create admin user
    const adminUser = new User({
      email: 'admin@mediequip.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin'
    });
    await adminUser.save();

    // Create clinic user
    const clinicUser = new User({
      email: 'clinic@example.com',
      password: 'clinic123',
      fullName: 'Clinic Manager',
      phone: '+91-9876543210',
      organization: 'City Medical Center',
      role: 'clinic'
    });
    await clinicUser.save();

    // Create sample machines
    const machines = [
      {
        machineName: "Digital X-Ray Machine",
        type: "Imaging Equipment",
        category: "Radiology",
        condition: "Excellent",
        description: "High-resolution digital X-ray system with advanced imaging capabilities. Perfect for clinics and small hospitals.",
        price: 45000,
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
        availability: true,
        repairHistory: [
          "Replaced imaging sensor - Jan 2024",
          "Calibration and alignment - Dec 2023",
        ],
        sparePartsReplaced: ["Imaging sensor", "Control panel display"],
        warrantyInfo: "12 months comprehensive warranty",
        rentalPricing: {
          perDay: 500,
          perWeek: 3000,
          perMonth: 10000,
        },
        createdBy: adminUser._id
      },
      {
        machineName: "Ultrasound Scanner",
        type: "Diagnostic Equipment",
        category: "Ultrasound",
        condition: "Good",
        description: "Portable ultrasound machine with color Doppler. Ideal for general practice and obstetrics.",
        price: 35000,
        image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80",
        availability: true,
        repairHistory: [
          "Probe replacement - Feb 2024",
          "Software update - Jan 2024",
        ],
        sparePartsReplaced: ["Ultrasound probe", "Power supply unit"],
        warrantyInfo: "9 months warranty on all parts",
        rentalPricing: {
          perDay: 400,
          perWeek: 2500,
          perMonth: 8500,
        },
        createdBy: adminUser._id
      },
      {
        machineName: "Patient Monitor",
        type: "Vital Signs Monitor",
        category: "Monitoring",
        condition: "Excellent",
        description: "Multi-parameter patient monitoring system. Tracks ECG, SpO2, blood pressure, and temperature.",
        price: 18000,
        image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80",
        availability: true,
        repairHistory: [
          "Display screen replacement - Mar 2024",
          "Battery replacement - Feb 2024",
        ],
        sparePartsReplaced: ["LCD display", "Internal battery", "ECG cables"],
        warrantyInfo: "6 months warranty",
        rentalPricing: {
          perDay: 200,
          perWeek: 1200,
          perMonth: 4000,
        },
        createdBy: adminUser._id
      },
      {
        machineName: "ECG Machine",
        type: "Cardiac Equipment",
        category: "Cardiology",
        condition: "Good",
        description: "12-channel ECG machine with digital recording and interpretation. Compact and portable design.",
        price: 12000,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        availability: false,
        repairHistory: [
          "Lead wire replacement - Feb 2024",
          "Printer mechanism service - Jan 2024",
        ],
        sparePartsReplaced: ["ECG leads", "Thermal printer head"],
        warrantyInfo: "12 months warranty",
        rentalPricing: {
          perDay: 150,
          perWeek: 900,
          perMonth: 3000,
        },
        createdBy: adminUser._id
      },
      {
        machineName: "Ventilator",
        type: "Respiratory Equipment",
        category: "Critical Care",
        condition: "Excellent",
        description: "Advanced ICU ventilator with multiple ventilation modes. Suitable for adult and pediatric patients.",
        price: 65000,
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80",
        availability: true,
        repairHistory: [
          "Flow sensor calibration - Mar 2024",
          "Filter replacement - Feb 2024",
        ],
        sparePartsReplaced: ["Flow sensors", "Air filters", "Breathing circuit"],
        warrantyInfo: "18 months comprehensive warranty",
        rentalPricing: {
          perDay: 800,
          perWeek: 5000,
          perMonth: 18000,
        },
        createdBy: adminUser._id
      },
      {
        machineName: "Laboratory Analyzer",
        type: "Lab Equipment",
        category: "Laboratory",
        condition: "Good",
        description: "Semi-automated chemistry analyzer for blood tests. Handles multiple parameters efficiently.",
        price: 28000,
        image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80",
        availability: true,
        repairHistory: [
          "Reagent dispenser service - Mar 2024",
          "Optical system cleaning - Jan 2024",
        ],
        sparePartsReplaced: ["Pump assembly", "Optical filters", "Cuvettes"],
        warrantyInfo: "12 months warranty on mechanical parts",
        rentalPricing: {
          perDay: 350,
          perWeek: 2100,
          perMonth: 7000,
        },
        createdBy: adminUser._id
      }
    ];

    await Machine.insertMany(machines);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin user: admin@mediequip.com / admin123');
    console.log('🏥 Clinic user: clinic@example.com / clinic123');
    console.log(`📦 Created ${machines.length} sample machines`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();