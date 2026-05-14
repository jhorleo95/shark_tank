interface Props {
  title: string;
  value: string;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="card p-6">
      <h3 className="text-slate-500">{title}</h3>
      <p className="text-4xl font-bold mt-4">{value}</p>
    </div>
  );
}
