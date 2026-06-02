import type { Hostel } from "@/lib/hostels";

type Props = {
  hostels: Hostel[];
  deleteConfirm: number | null;
  isPending: boolean;
  onEdit: (hostel: Hostel) => void;
  onDeleteConfirm: (id: number | null) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
};

export function HostelList({
  hostels,
  deleteConfirm,
  isPending,
  onEdit,
  onDeleteConfirm,
  onDelete,
  onAdd,
}: Props) {
  if (hostels.length === 0) {
    return (
      <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-black/6">
        <p className="text-[13px] text-muted-foreground">No hostels yet.</p>
        <button
          onClick={onAdd}
          className="mt-3 text-[13px] font-medium text-foreground underline-offset-2 hover:underline"
        >
          Add your first hostel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {hostels.map((hostel) => (
        <div
          key={hostel.id}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hostel.image}
            alt={hostel.name}
            className="h-14 w-20 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-foreground">{hostel.name}</p>
            <p className="text-[12px] text-muted-foreground">{hostel.tagline}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                {hostel.gender}
              </span>
              <span className="text-[12px] font-medium text-foreground">{hostel.price}</span>
              <span className="text-[11px] text-muted-foreground">/{hostel.slug}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => onEdit(hostel)}
              className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-medium text-foreground transition hover:bg-neutral-50"
            >
              Edit
            </button>
            {deleteConfirm === hostel.id ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">Sure?</span>
                <button
                  onClick={() => onDelete(hostel.id)}
                  disabled={isPending}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  Delete
                </button>
                <button
                  onClick={() => onDeleteConfirm(null)}
                  className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => onDeleteConfirm(hostel.id)}
                className="rounded-lg border border-red-100 px-3 py-1.5 text-[12px] font-medium text-red-400 transition hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
