import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, TabKey } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { MeasuresTab } from './components/MeasuresTab';
import { CoachTab } from './components/CoachTab';
import { HabitsTab } from './components/HabitsTab';
import { ReportTab } from './components/ReportTab';
import { ProfileTab } from './components/ProfileTab';
import { QuickAddModal } from './components/QuickAddModal';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import { MedicalSafetyBanner } from './components/MedicalSafetyBanner';
import { LegalModal } from './components/LegalModal';
import { BloodPressureMeasurement, HabitEntry, UserProfile } from './types';
import { generate60DaysDemoData, DEFAULT_USER_PROFILE } from './utils/mockData';

const STORAGE_KEYS = {
  MEASUREMENTS: 'tensicoach_measurements_v1',
  HABITS: 'tensicoach_habits_v1',
  PROFILE: 'tensicoach_profile_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [measurements, setMeasurements] = useState<BloodPressureMeasurement[]>([]);
  const [habits, setHabits] = useState<HabitEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [emergencyValues, setEmergencyValues] = useState<{ sys: number; dia: number }>({
    sys: 180,
    dia: 120,
  });

  // Initial Load from localStorage or Demo Generator
  useEffect(() => {
    try {
      const storedM = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
      const storedH = localStorage.getItem(STORAGE_KEYS.HABITS);
      const storedP = localStorage.getItem(STORAGE_KEYS.PROFILE);

      if (storedM && storedH) {
        setMeasurements(JSON.parse(storedM));
        setHabits(JSON.parse(storedH));
      } else {
        // Initialize 60 days of realistic demo data
        const demo = generate60DaysDemoData();
        setMeasurements(demo.measurements);
        setHabits(demo.habits);
        localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(demo.measurements));
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(demo.habits));
      }

      if (storedP) {
        setUserProfile(JSON.parse(storedP));
      } else {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
      }
    } catch (e) {
      console.warn('Error loading local data, fallback to demo dataset', e);
      const demo = generate60DaysDemoData();
      setMeasurements(demo.measurements);
      setHabits(demo.habits);
    }
  }, []);

  // Save changes to localStorage
  const saveMeasurements = (newList: BloodPressureMeasurement[]) => {
    setMeasurements(newList);
    try {
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const saveHabits = (newHabits: HabitEntry[]) => {
    setHabits(newHabits);
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(newHabits));
    } catch (e) {
      console.error(e);
    }
  };

  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  // Add new measurement
  const handleAddMeasurement = (newM: Omit<BloodPressureMeasurement, 'id'>) => {
    const created: BloodPressureMeasurement = {
      ...newM,
      id: `m-${Date.now()}`,
    };

    const updated = [created, ...measurements];
    saveMeasurements(updated);

    // Crisis trigger check
    if (created.systolic >= 180 || created.diastolic >= 120) {
      setEmergencyValues({ sys: created.systolic, dia: created.diastolic });
      setIsEmergencyModalOpen(true);
    }
  };

  // Delete measurement
  const handleDeleteMeasurement = (id: string) => {
    const updated = measurements.filter((m) => m.id !== id);
    saveMeasurements(updated);
  };

  // Update today's habits
  const handleUpdateTodayHabit = (entry: HabitEntry) => {
    const filtered = habits.filter((h) => h.date !== entry.date);
    const updated = [entry, ...filtered];
    saveHabits(updated);
  };

  // Reset to initial 60 days demo
  const handleResetDemoData = () => {
    const demo = generate60DaysDemoData();
    saveMeasurements(demo.measurements);
    saveHabits(demo.habits);
    saveProfile(DEFAULT_USER_PROFILE);
    setActiveTab('home');
  };

  // Clear all data
  const handleClearAllData = () => {
    saveMeasurements([]);
    saveHabits([]);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-200">
      {/* Top Navbar */}
      <Navbar
        onOpenSOS={() => {
          setEmergencyValues({ sys: 180, dia: 120 });
          setIsEmergencyModalOpen(true);
        }}
        onOpenLegal={() => setIsLegalModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 pb-24">
        {activeTab === 'home' && (
          <HomeTab
            measurements={measurements}
            habits={habits}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onNavigateToTab={(tab: TabKey) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'measures' && (
          <MeasuresTab
            measurements={measurements}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onDeleteMeasurement={handleDeleteMeasurement}
          />
        )}

        {activeTab === 'coach' && (
          <CoachTab measurements={measurements} habits={habits} />
        )}

        {activeTab === 'habits' && (
          <HabitsTab habits={habits} onUpdateTodayHabit={handleUpdateTodayHabit} />
        )}

        {activeTab === 'report' && (
          <ReportTab
            userProfile={userProfile}
            measurements={measurements}
            habits={habits}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            userProfile={userProfile}
            onUpdateProfile={saveProfile}
            onResetDemoData={handleResetDemoData}
            onClearAllData={handleClearAllData}
            onOpenLegal={() => setIsLegalModalOpen(true)}
          />
        )}
      </main>

      {/* Permanent Reassuring Medical Safety Disclaimer */}
      <div className="fixed bottom-16 left-0 right-0 z-30 pointer-events-auto">
        <MedicalSafetyBanner onOpenLegal={() => setIsLegalModalOpen(true)} />
      </div>

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab: TabKey) => setActiveTab(tab)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Quick Add Modal (< 3 interactions) */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSave={handleAddMeasurement}
        onTriggerCrisisAlert={(sys, dia) => {
          setEmergencyValues({ sys, dia });
          setIsEmergencyModalOpen(true);
        }}
      />

      {/* Emergency Crisis Alert Modal */}
      <EmergencyAlertModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        systolic={emergencyValues.sys}
        diastolic={emergencyValues.dia}
      />

      {/* Dedicated Legal & Medical Safety Modal */}
      <LegalModal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} />
    </div>
  );
}
