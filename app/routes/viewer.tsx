import React from 'react';
import LeftSidebar from '../components/LeftSidebar';
import ContentBody from '../components/ContentBody';
import RightPlayground from '../components/RightPlayground';

export default function Viewer() {
  return (
    <main className="pt-16 pb-4 container mx-auto flex gap-4" style={{height: 'calc(100vh - 6rem)'}}>
      <LeftSidebar />
      <ContentBody />
      <RightPlayground />
    </main>
  );
}
