"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Bruto bilanca"
    subtitle="Detaljna bruto bilanca po kontima"
    columns={[
      { key: "konto", label: "Konto" },
      { key: "naziv", label: "Naziv" },
      { key: "duguje", label: "Duguje (EUR)", align: "right" },
      { key: "potrazuje", label: "Potražuje (EUR)", align: "right" },
      { key: "saldo", label: "Saldo (EUR)", align: "right" },
    ]}
    data={[
      { konto: "1000", naziv: "Žiro račun", duguje: "45.200,00", potrazuje: "26.750,00", saldo: "18.450,00" },
      { konto: "1200", naziv: "Potraživanja od kupaca", duguje: "32.400,00", potrazuje: "26.600,00", saldo: "5.800,00" },
      { konto: "2200", naziv: "Obveze prema dobavljačima", duguje: "12.100,00", potrazuje: "17.610,00", saldo: "-5.510,00" },
      { konto: "3000", naziv: "Temeljni kapital", duguje: "0,00", potrazuje: "2.500,00", saldo: "-2.500,00" },
      { konto: "7500", naziv: "Prihodi od usluga", duguje: "0,00", potrazuje: "45.200,00", saldo: "-45.200,00" },
    ]}
  />;
}