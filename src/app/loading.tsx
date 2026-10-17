export default function Loading() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--navbar-h, 4rem))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            border: "3px solid var(--border)",
            borderTopColor: "var(--color-brand-500, #6366f1)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Loading OwnSpace...
        </p>
      </div>
    </div>
  );
}
