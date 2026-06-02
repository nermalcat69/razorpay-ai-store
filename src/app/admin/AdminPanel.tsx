"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Hostel } from "@/lib/hostels";
import { createHostelAction, updateHostelAction, deleteHostelAction, logoutAction } from "./actions";
import { HostelForm, DEFAULT_FORM, hostelToForm, formToHostelInput, type HostelFormData } from "./HostelForm";
import { HostelList } from "./HostelList";
import { TransactionsList, type Transaction } from "./TransactionsList";

type Tab = "hostels" | "transactions";
type View = "list" | "add" | "edit";

export default function AdminPanel({
  hostels,
  transactions,
}: {
  hostels: Hostel[];
  transactions: Transaction[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("hostels");
  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<HostelFormData>(DEFAULT_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  function openAdd() {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setView("add");
  }

  function openEdit(hostel: Hostel) {
    setForm(hostelToForm(hostel));
    setEditingId(hostel.id);
    setView("edit");
  }

  function handleSubmit() {
    const data = formToHostelInput(form);
    startTransition(async () => {
      if (view === "add") await createHostelAction(data);
      else if (editingId !== null) await updateHostelAction(editingId, data);
      setView("list");
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteHostelAction(id);
      setDeleteConfirm(null);
      router.refresh();
    });
  }

  function handleLogout() {
    startTransition(() => logoutAction());
  }

  if (view === "add" || view === "edit") {
    return (
      <HostelForm
        mode={view}
        form={form}
        isPending={isPending}
        onChange={setForm}
        onSubmit={handleSubmit}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
            <p className="text-[12px] text-muted-foreground">Jeevan PG — manage hostels</p>
          </div>
          <div className="flex items-center gap-2">
            {tab === "hostels" && (
              <button
                onClick={openAdd}
                className="rounded-xl bg-foreground px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
              >
                + Add hostel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-black/10 px-4 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-white"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mb-5 flex gap-1 rounded-xl bg-white p-1 ring-1 ring-black/6 w-fit">
          {(["hostels", "transactions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-[12px] font-medium capitalize transition ${
                tab === t ? "bg-foreground text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {t === "transactions" && transactions.length > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${tab === t ? "bg-white/20" : "bg-neutral-100"}`}>
                  {transactions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "transactions" && <TransactionsList transactions={transactions} />}

        {tab === "hostels" && (
          <HostelList
            hostels={hostels}
            deleteConfirm={deleteConfirm}
            isPending={isPending}
            onEdit={openEdit}
            onDeleteConfirm={setDeleteConfirm}
            onDelete={handleDelete}
            onAdd={openAdd}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Changes are saved to Turso and the frontend cache is revalidated automatically.
        </p>
      </div>
    </div>
  );
}
