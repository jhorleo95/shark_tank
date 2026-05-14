interface Props {
  page: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, setPage }: Props) {
  return (
    <div className="flex items-center justify-center gap-5 mt-8">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="bg-slate-200 px-5 py-3 rounded-xl"
      >
        Anterior
      </button>
      <span className="font-bold text-xl">{page}</span>
      <button
        onClick={() => setPage(page + 1)}
        className="bg-[var(--primary)] text-white px-5 py-3 rounded-xl"
      >
        Siguiente
      </button>
    </div>
  );
}
