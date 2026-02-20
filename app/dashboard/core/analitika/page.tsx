"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Analitičke kartice"
    subtitle="Kartice po klijentu, dobavljaču, kontu"
    columns={[
      { key: "tip", label: "Tip" },
      { key: "naziv", label: "Naziv" },
      { key: "duguje", label: "Duguje (EUR)", align: "right" },
      { key: "potrazuje", label: "Potražuje (EUR)", align: "right" },
      { key: "saldo", label: "Saldo (EUR)", align: "right" },
    ]}
    data={[
      { tip: "Kupac", naziv: "SPV SAN-01", duguje: "15.200,00", potrazuje: "12.700,00", saldo: "2.500,00" },
      { tip: "Kupac", naziv: "SPV SAN-02", duguje: "10.400,00", potrazuje: "8.300,00", saldo: "2.100,00" },
      { tip: "Kupac", naziv: "Arhitekt d.o.o.", duguje: "6.800,00", potrazuje: "5.600,00", saldo: "1.200,00" },
      { tip: "Dobavljač", naziv: "Odvjetnik d.o.o.", duguje: "4.500,00", potrazuje: "5.250,00", saldo: "-750,00" },
      { tip: "Dobavljač", naziv: "Vercel Inc.", duguje: "120,00", potrazuje: "120,00", saldo: "0,00" },
    ]}
  />;
}