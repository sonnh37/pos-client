"use client";
import { Toaster } from "@/components/_common/toast";
import store from "@/lib/redux/store";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Provider store={store}>{children}</Provider>
      <Toaster />
    </>
  );
}
