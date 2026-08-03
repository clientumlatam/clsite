import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { StrategyTab } from './components/StrategyTab';
import { CopywriterTab } from './components/CopywriterTab';
import { SeoTab } from './components/SeoTab';
import { ClientsTab } from './components/ClientsTab';
import { ChatTab } from './components/ChatTab';
import { ContactsTab } from './components/ContactsTab';
import { ListsTab } from './components/ListsTab';
import { EmailCampaignsTab } from './components/EmailCampaignsTab';
import { TemplatesTab } from './components/TemplatesTab';
import { AutomationsTab } from './components/AutomationsTab';
import { ImportExportTab } from './components/ImportExportTab';
import { SmtpTab } from './components/SmtpTab';
import { SettingsTab } from './components/SettingsTab';
import { KeywordResearchTab } from './components/KeywordResearchTab';
import { KeywordVaultTab } from './components/KeywordVaultTab';
import { TopicMapTab } from './components/TopicMapTab';
import { OnPageAuditTab } from './components/OnPageAuditTab';
import { ContentCalendarTab } from './components/ContentCalendarTab';
import { LinkBuildingTab } from './components/LinkBuildingTab';
import { RankTrackerTab } from './components/RankTrackerTab';
import { SeoAutomationTab } from './components/SeoAutomationTab';
import { AiHubTab } from './components/AiHubTab';
import { MeddicTab } from './components/MeddicTab';
import { IcpBuilderTab } from './components/IcpBuilderTab';
import { CrmKanbanTab } from './components/CrmKanbanTab';
import { EmailTemplateBuilderTab } from './components/EmailTemplateBuilderTab';
import { GeolocatedProspectingTab } from './components/GeolocatedProspectingTab';
import { AnalyticsDashboardTab } from './components/AnalyticsDashboardTab';
import { BrochureGeneratorTab } from './components/BrochureGeneratorTab';
import { OutreachAgentTab } from './components/OutreachAgentTab';
import { WorkflowTab } from './components/WorkflowTab';
import { CommandPalette } from './components/CommandPalette';
import { Breadcrumbs } from './components/Breadcrumbs';
import PublicWebsite from './components/PublicWebsite';
import { AuthButton } from './components/AuthButton';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currency, setCurrency] = useState('USD');
  const [region, setRegion] = useState('LATAM (All)');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setCurrentUser(data.user.username);
          return;
        }
      }
      setCurrentUser(null);
    } catch (err) {
      console.warn('[App] Session check failed:', err);
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      window.dispatchEvent(new Event('auth-changed'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSession();
    const handleAuthChange = () => {
      fetchSession();
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  if (activeTab === 'public_website') {
    return (
      <div className="w-screen h-screen overflow-hidden bg-slate-900">
        <PublicWebsite 
          onBackToEditor={() => setActiveTab('overview')}
          authUser={currentUser}
          onOpenLogin={() => {
            window.dispatchEvent(new CustomEvent('open-login-modal'));
          }}
          onLogout={handleLogout}
        />
        {/* Helper AuthButton wrapper so its event listener handles open-login-modal triggers */}
        <div className="hidden">
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          currency={currency}
          setCurrency={setCurrency}
          region={region}
          setRegion={setRegion}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            />
            {activeTab === 'overview' && <OverviewTab currency={currency} region={region} />}
            {activeTab === 'ai_hub' && <AiHubTab />}
            {activeTab === 'meddic' && <MeddicTab />}
            {activeTab === 'icp_builder' && <IcpBuilderTab />}
            {activeTab === 'crm_kanban' && <CrmKanbanTab />}
            {activeTab === 'email_template_builder' && <EmailTemplateBuilderTab />}
            {activeTab === 'geolocated_prospecting' && <GeolocatedProspectingTab />}
            {activeTab === 'analytics_dashboard' && <AnalyticsDashboardTab />}
            {activeTab === 'brochure_generator' && <BrochureGeneratorTab />}
            {activeTab === 'outreach_agent' && <OutreachAgentTab />}
            {activeTab === 'strategy' && <StrategyTab />}
            {activeTab === 'copywriter' && <CopywriterTab />}
            {activeTab === 'seo' && <SeoTab />}
            {activeTab === 'clients' && <ClientsTab />}
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'contacts' && <ContactsTab />}
            {activeTab === 'lists' && <ListsTab />}
            {activeTab === 'email_campaigns' && <EmailCampaignsTab />}
            {activeTab === 'templates' && <TemplatesTab />}
            {activeTab === 'automations' && <AutomationsTab />}
            {activeTab === 'import_export' && <ImportExportTab />}
            {activeTab === 'smtp' && <SmtpTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'keyword_research' && <KeywordResearchTab />}
            {activeTab === 'keyword_vault' && <KeywordVaultTab />}
            {activeTab === 'topic_map' && <TopicMapTab />}
            {activeTab === 'on_page_audit' && <OnPageAuditTab />}
            {activeTab === 'content_calendar' && <ContentCalendarTab />}
            {activeTab === 'link_building' && <LinkBuildingTab />}
            {activeTab === 'rank_tracker' && <RankTrackerTab />}
            {activeTab === 'seo_automation' && <SeoAutomationTab />}
            {activeTab === 'workflow' && <WorkflowTab setActiveTab={setActiveTab} />}
          </div>
        </main>
      </div>

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

