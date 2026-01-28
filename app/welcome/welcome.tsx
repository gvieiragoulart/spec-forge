import React from "react";
import FileUploader from "../components/input_yaml";
import { useYaml } from "../context/YamlContext";
import Sidebar from "../components/LeftSidebar";
import ContentBody from "../components/ContentBody";

export function Welcome() {
  const { data } = useYaml();
  
  if (!data) {
    return (
      <main className="flex items-center justify-center pt-16 pb-4">
        <FileUploader />
      </main>
    );
  }

  return (
    <main className="pt-16 pb-4 container mx-auto flex gap-4" style={{height: 'calc(100vh - 6rem)'}}>
      <Sidebar />
      <ContentBody />
    </main>
  );
}