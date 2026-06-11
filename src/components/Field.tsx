type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Field({
  label,
  name,
  type = "text",
  value,
  placeholder,
  required,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
      />
    </label>
  );
}
