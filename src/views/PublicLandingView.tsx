import React from 'react';
import { PageRoute } from '../types';
import { useCreatorStore } from '../store/creatorStore';
import { CreatorLandingTemplate } from '../components/CreatorLandingTemplate';

interface PublicLandingViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onNavigate }) => {
  const { creator } = useCreatorStore();

  return (
    <div className="min-h-screen bg-[#090D16]">
      {/* Standalone Public View (No Dashboard Access or Creator Settings) */}
      <CreatorLandingTemplate
        creator={creator}
        isPublic={true}
        onNavigateHome={() => onNavigate('home')}
      />
    </div>
  );
};
