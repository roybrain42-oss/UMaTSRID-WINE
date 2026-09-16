/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { EcoSortProvider, useEcoSort } from './context/EcoSortContext';
import { HeaderNavigation } from './components/layout/HeaderNavigation';
import { SystemInfographicView } from './components/infographic/SystemInfographicView';
import { VirtualRobotSimulation } from './components/robot/VirtualRobotSimulation';
import { UserUploadEarn } from './components/user/UserUploadEarn';
import { CollectorAppView } from './components/collector/CollectorAppView';
import { UserDashboardView } from './components/user/UserDashboardView';
import { LeaderboardChallengesView } from './components/challenges/LeaderboardChallengesView';
import { RewardMarketplaceView } from './components/rewards/RewardMarketplaceView';
import { RecyclerPortalView } from './components/recycler/RecyclerPortalView';
import { CommunityDashboardView } from './components/community/CommunityDashboardView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminLoginForm } from './components/auth/AdminLoginForm';
import { AdminAuthModal } from './components/auth/AdminAuthModal';
import { EnvironmentalImpactView } from './components/impact/EnvironmentalImpactView';
import { CompetitionDemoMode } from './components/demo/CompetitionDemoMode';
import { ToastContainer } from './components/ui/ToastNotification';
import { UserRegistrationModal } from './components/auth/UserRegistrationModal';
import { EditProfileModal } from './components/auth/EditProfileModal';
import { CashOutModal } from './components/wallet/CashOutModal';
import { InstallApkModal } from './components/apk/InstallApkModal';
import { PushNotificationBanner } from './components/common/PushNotificationBanner';
import { PushNotificationCenterModal } from './components/common/PushNotificationCenterModal';
import { OfflineSyncBanner } from './components/common/OfflineSyncBanner';
import { OfflineQueueModal } from './components/common/OfflineQueueModal';
import { ShareImpactModal } from './components/user/ShareImpactModal';
import { InstantScanModal } from './components/camera/InstantScanModal';
import { BiometricPromptModal } from './components/common/BiometricPromptModal';
import { MobileAppHeader } from './components/layout/MobileAppHeader';
import { MobileBottomNavigation } from './components/layout/MobileBottomNavigation';
import { DeviceFrameSimulator } from './components/layout/DeviceFrameSimulator';
import { AuthScreen } from './components/auth/AuthScreen';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    currentUser, 
    setCurrentView,
    isRegistered,
    isAdminAuthenticated,
    showShareImpactModal,
    closeShareImpactModal,
    shareImpactCustomStats,
    showBiometricModal,
    biometricPromptOptions,
    closeBiometricPrompt
  } = useEcoSort();

  const isAdmin = currentUser.role === 'ADMIN';

  // Force Login and Sign-Up page to be the first screen when the app is launched on a device
  if (!isRegistered) {
    return (
      <DeviceFrameSimulator>
        <div className="min-h-screen bg-[#0F172A] text-slate-100 antialiased font-sans flex flex-col justify-between relative">
          <ToastContainer />
          <AuthScreen initialTab="SIGN_UP" />
          <BiometricPromptModal
            isOpen={showBiometricModal}
            options={biometricPromptOptions}
            onClose={closeBiometricPrompt}
            onSuccess={(result) => {
              if (biometricPromptOptions?.onSuccess) {
                biometricPromptOptions.onSuccess(result);
              }
            }}
          />
        </div>
      </DeviceFrameSimulator>
    );
  }

  return (
    <DeviceFrameSimulator>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between relative pb-20 xl:pb-0">
        {/* Real-Time Toast Notification Stack */}
        <ToastContainer />

        {/* Simulated OS-Style Push Notification Banner */}
        <PushNotificationBanner />

        {/* Global Modals (Auth, Admin Auth, Edit Profile, MoMo Cash Out, APK, Push Simulator Studio, Offline Queue, Share Impact, Biometric Prompt) */}
        <UserRegistrationModal />
        <AdminAuthModal />
        <EditProfileModal />
        <CashOutModal />
        <InstallApkModal />
        <PushNotificationCenterModal />
        <OfflineQueueModal />
        <ShareImpactModal 
          isOpen={showShareImpactModal} 
          onClose={closeShareImpactModal}
          customStats={shareImpactCustomStats}
        />
        <InstantScanModal />
        <BiometricPromptModal
          isOpen={showBiometricModal}
          options={biometricPromptOptions}
          onClose={closeBiometricPrompt}
          onSuccess={(result) => {
            if (biometricPromptOptions?.onSuccess) {
              biometricPromptOptions.onSuccess(result);
            }
          }}
        />

        <div>
          {/* Offline / Online Realtime Sync Connectivity Bar */}
          <OfflineSyncBanner />

          {/* Desktop Navigation Header */}
          <div className="hidden xl:block">
            <HeaderNavigation />
          </div>

          {/* Mobile Top App Bar */}
          <MobileAppHeader />
          
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            {currentView === 'infographic' && (isAdmin && isAdminAuthenticated ? <SystemInfographicView /> : <UserDashboardView />)}
            {currentView === 'virtual-robot' && <VirtualRobotSimulation />}
            {currentView === 'smart-bin' && (
              isAdmin && isAdminAuthenticated ? (
                <AdminDashboardView />
              ) : (
                <div className="py-8 flex flex-col items-center justify-center min-h-[50vh]">
                  <AdminLoginForm 
                    onSuccess={() => setCurrentView('admin')}
                    onCancel={() => setCurrentView('user-dashboard')}
                  />
                </div>
              )
            )}
            {currentView === 'user-app' && <UserUploadEarn />}
            {currentView === 'collector-app' && <CollectorAppView />}
            {currentView === 'user-dashboard' && <UserDashboardView />}
            {currentView === 'leaderboard' && <LeaderboardChallengesView />}
            {currentView === 'rewards' && <RewardMarketplaceView />}
            {currentView === 'community' && <CommunityDashboardView />}
            {currentView === 'recycler' && <RecyclerPortalView />}
            {currentView === 'admin' && (
              isAdmin && isAdminAuthenticated ? (
                <AdminDashboardView />
              ) : (
                <div className="py-8 flex flex-col items-center justify-center min-h-[50vh]">
                  <AdminLoginForm 
                    onSuccess={() => setCurrentView('admin')}
                    onCancel={() => setCurrentView('user-dashboard')}
                  />
                </div>
              )
            )}
            {currentView === 'impact' && <EnvironmentalImpactView />}
            {currentView === 'demo' && <CompetitionDemoMode />}
          </main>
        </div>

        {/* Mobile Bottom Dock Navigation Bar */}
        <MobileBottomNavigation />

        {/* Professional Bottom Enterprise Footer (Desktop) */}
        <footer className="hidden xl:block bg-[#0F172A] border-t border-slate-800 text-slate-400 py-6 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="EcoSort" 
                className="w-6 h-6 rounded-md object-contain bg-white p-0.5 shadow-xs ring-1 ring-white/20"
                referrerPolicy="no-referrer"
              />
              <span className="font-medium text-slate-200">
                © 2026 <strong className="text-white">EcoSort</strong> • National Smart Recycling & AI Robotics Protocol
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                EPA Ghana Gateway v4.2.1 • Operational
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Verified AI Autonomous Grid</span>
            </div>
          </div>
        </footer>
      </div>
    </DeviceFrameSimulator>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EcoSort caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('ecosort_ghana_state_v2');
      sessionStorage.removeItem('ecosort_session_active');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-slate-900">EcoSort Runtime Recovery</h2>
            <p className="text-sm text-slate-600">
              The application encountered a temporary state glitch. Click below to restore full verified Ghana pilot data.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Reset to Default Pilot State & Reload
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Retry Rendering
              </button>
            </div>
          </div>
        </div>
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any).props?.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <EcoSortProvider>
        <AppContent />
      </EcoSortProvider>
    </ErrorBoundary>
  );
}
